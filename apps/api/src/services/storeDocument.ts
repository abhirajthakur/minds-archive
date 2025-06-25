import { TaskType } from "@google/generative-ai";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document, Prisma, prisma } from "@workspace/database";
import "dotenv/config";
import { BufferLoader } from "langchain/document_loaders/fs/buffer";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const getVectorStore = (): PrismaVectorStore<
	Document,
	"Document",
	any,
	any
> => {
	const embeddings = new GoogleGenerativeAIEmbeddings({
		model: "embedding-001",
		taskType: TaskType.RETRIEVAL_DOCUMENT,
		apiKey: process.env.GOOGLE_API_KEY,
	});

	const vectorStore = PrismaVectorStore.withModel<Document>(prisma).create(
		embeddings,
		{
			prisma: Prisma,
			tableName: "Document",
			vectorColumnName: "vector",
			columns: {
				id: PrismaVectorStore.IdColumn,
				content: PrismaVectorStore.ContentColumn,
			},
		},
	);

	return vectorStore;
};

const getLoaderForFile = (
	file: Express.Multer.File,
): BufferLoader | TextLoader => {
	if (
		file.mimetype ===
		"application/vnd.openxmlformats-officedocument.presentationml.presentation"
	) {
		return new PPTXLoader(file.path);
	} else if (
		file.mimetype ===
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	) {
		return new DocxLoader(file.path);
	} else if (file.mimetype === "application/pdf") {
		return new PDFLoader(file.path);
	} else {
		return new TextLoader(file.path);
	}
};

const processDocument = async (
	file: Express.Multer.File,
	vectorStore: PrismaVectorStore<Document, "Document", any, any>,
) => {
	try {
		const loader = getLoaderForFile(file);
		const docs = await loader.load();
		console.log(`Loaded ${docs.length} documents`);
		if (docs.length > 0) {
			console.log("Sample content:", docs[0]?.pageContent.substring(0, 100));
		}

		const textSplitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 100,
		});

		const texts = await textSplitter.splitDocuments(docs);
		console.log(`Split into ${texts.length} chunks`);

		const validTexts = texts.filter(
			(doc) =>
				doc.pageContent &&
				typeof doc.pageContent === "string" &&
				doc.pageContent.trim() !== "",
		);
		console.log(`${validTexts.length} valid chunks after filtering`);

		const createdDocs = await prisma.$transaction(
			validTexts.map((doc) =>
				prisma.document.create({
					data: {
						name: file.originalname,
						content: doc.pageContent,
						size: file.size,
					},
				}),
			),
		);

		await vectorStore.addModels(createdDocs);
	} catch (error) {
		console.error(`Error processing document ${file.originalname}:`, error);
	}
};

export const storeDocument = async (files: Express.Multer.File[]) => {
	try {
		const vectorStore = getVectorStore();

		await Promise.all(files.map((file) => processDocument(file, vectorStore)));

		console.log("Documents added successfully");
		await checkDocuments();
	} catch (error) {
		console.error("Error in storeDocument:", error);
		if (error instanceof Error) {
			console.error("Error message:", error.message);
			console.error("Error stack:", error.stack);
		}
	}
};

export const checkDocuments = async () => {
	try {
		const count = await prisma.document.count();
		console.log(`Found ${count} documents in the database.`);

		if (count > 0) {
			const sample = await prisma.document.findFirst();
			console.log("Sample document:", sample);
		}
	} catch (error) {
		console.error("Error checking documents:", error);
	}
};
