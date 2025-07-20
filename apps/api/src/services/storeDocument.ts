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
    apiKey: process.env.GOOGLE_API_KEY!,
  });

  return PrismaVectorStore.withModel<Document>(prisma).create(embeddings, {
    prisma: Prisma,
    tableName: "Document",
    vectorColumnName: "vector",
    columns: {
      id: PrismaVectorStore.IdColumn,
      content: PrismaVectorStore.ContentColumn,
    },
  });
};

const getFileLoader = (
  file: Express.Multer.File,
): BufferLoader | TextLoader => {
  const { mimetype, path } = file;

  switch (mimetype) {
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return new PPTXLoader(path);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return new DocxLoader(path);
    case "application/pdf":
      return new PDFLoader(path);
    default:
      return new TextLoader(path);
  }
};

// === DOCUMENT PROCESSING ===
const processFile = async (
  file: Express.Multer.File,
  vectorStore: PrismaVectorStore<Document, "Document", any, any>,
  conversationId?: string,
): Promise<Document[]> => {
  const loader = getFileLoader(file);
  const rawDocs = await loader.load();

  if (rawDocs.length === 0) {
    console.warn(`No content found in ${file.originalname}`);
    return [];
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const chunks = await splitter.splitDocuments(rawDocs);
  const validChunks = chunks.filter((doc) => doc.pageContent?.trim());

  if (validChunks.length === 0) {
    console.warn(`No valid chunks in ${file.originalname}`);
    return [];
  }

  const savedDocs = await prisma.$transaction(
    validChunks.map((chunk) =>
      prisma.document.create({
        data: {
          name: file.originalname,
          content: chunk.pageContent,
          size: file.size,
          conversationId: conversationId || null,
        },
      }),
    ),
  );

  await vectorStore.addModels(savedDocs);
  return savedDocs;
};

export const storeDocuments = async (
  files: Express.Multer.File[],
  conversationId?: string,
): Promise<Document[]> => {
  const vectorStore = getVectorStore();
  const allDocuments: Document[] = [];

  try {
    const results = await Promise.allSettled(
      files.map((file) => processFile(file, vectorStore, conversationId)),
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        allDocuments.push(...result.value);
      } else {
        console.error("Failed to process file:", result.reason);
      }
    }

    console.log("All valid documents stored successfully");
    return allDocuments;
  } catch (err) {
    console.error("Unexpected error in storeDocuments:", err);
    throw err;
  }
};
