import { TaskType } from "@google/generative-ai";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document, Prisma, prisma } from "@workspace/database";
import { BufferLoader } from "langchain/document_loaders/fs/buffer";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import fs from "fs";
import os from "os";
import path from "path";
import "dotenv/config";

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
  tempFilePath: string,
  mimetype: string,
): BufferLoader | TextLoader => {
  switch (mimetype) {
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return new PPTXLoader(tempFilePath);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return new DocxLoader(tempFilePath);
    case "application/pdf":
      return new PDFLoader(tempFilePath);
    default:
      return new TextLoader(tempFilePath);
  }
};

const createTempFile = async (
  buffer: Buffer,
  originalName: string,
): Promise<string> => {
  const tempDir = os.tmpdir();
  const fileExtension = path.extname(originalName);
  const tempFileName = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
  const tempFilePath = path.join(tempDir, tempFileName);

  await fs.promises.writeFile(tempFilePath, buffer);
  return tempFilePath;
};

const cleanupTempFile = async (filePath: string): Promise<void> => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.warn(`Failed to cleanup temp file ${filePath}:`, error);
  }
};

// === DOCUMENT PROCESSING ===
const processFile = async (
  file: Express.Multer.File,
  vectorStore: PrismaVectorStore<Document, "Document", any, any>,
  conversationId?: string,
): Promise<Document[]> => {
  let tempFilePath: string | null = null;

  try {
    console.log(`Processing ${file.originalname}...`);

    tempFilePath = await createTempFile(file.buffer, file.originalname);

    const loader = getFileLoader(tempFilePath, file.mimetype);
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
    console.log(
      `Successfully processed ${file.originalname} into ${savedDocs.length} chunks`,
    );
    return savedDocs;
  } catch (error) {
    console.error(`Error processing file ${file.originalname}:`, error);
    throw error;
  } finally {
    if (tempFilePath) {
      await cleanupTempFile(tempFilePath);
    }
  }
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
