import cors from "cors";
import express, { Request, Response } from "express";
import multer from "multer";
import { storeDocument } from "./services/storeDocument";
import { queryDocument } from "./services/queryDocument";

const PORT = process.env.PORT || 8080;

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, `${uniqueSuffix}-${file.originalname}`);
	},
});

const app = express();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());

app.post(
	"/api/store",
	upload.array("files", 5),
	async (req: Request, res: Response) => {
		await storeDocument(req.files as Express.Multer.File[]);

		res.json({
			message: "Success stored the documents embeddings!",
		});
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
