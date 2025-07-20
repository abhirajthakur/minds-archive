import cors from "cors";
import express, { Request, Response } from "express";
import multer from "multer";
import { prisma } from "@workspace/database";
import { queryDocument } from "./services/queryDocument";
import { storeDocuments } from "./services/storeDocument";

const PORT = process.env.PORT || 8080;

const app = express();
// Use memory storage to handle file uploads in memory before sending to Cloudinary
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

app.use(express.json());
app.use(cors());

app.post(
  "/api/store",
  upload.array("files", 5),
  async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.body;
      const documents = await storeDocuments(
        req.files as Express.Multer.File[],
        conversationId,
      );

      res.json({
        documents,
      });
    } catch (error) {
      throw error;
    }
  },
);

app.post("/api/conversations", async (_req: Request, res: Response) => {
  try {
    const conversation = await prisma.conversation.create({
      data: {},
      include: {
        documents: true,
        messages: true,
      },
    });

    res.json({ conversation });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

app.get("/api/conversations/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc", // Get messages in chronological order
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            size: true,
          },
        },
      },
    });

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    res.json({ conversation });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

app.post(
  "/api/conversations/:id/documents",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { documentIds } = req.body;

      await prisma.document.updateMany({
        where: {
          id: {
            in: documentIds,
          },
          conversationId: null, // Only update documents not already associated
        },
        data: {
          conversationId: id,
        },
      });

      const conversation = await prisma.conversation.findUnique({
        where: { id },
        include: {
          documents: true,
          messages: true,
        },
      });

      res.json({ conversation });
    } catch (error) {
      console.error("Error associating documents with conversation:", error);
      res.status(500).json({ error: "Failed to associate documents" });
    }
  },
);

app.post("/api/chat", async (req: Request, res: Response) => {
  const { conversationId, query } = req.body;
  const result = await queryDocument(conversationId, query);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  result.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
