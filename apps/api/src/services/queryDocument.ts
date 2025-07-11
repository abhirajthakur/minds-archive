import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { prisma } from "@workspace/database";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { getVectorStore } from "./storeDocument";
import { Readable } from "stream";

export async function queryDocument(conversationId: string, query: string) {
	try {
		await prisma.conversation.update({
			where: {
				id: conversationId,
			},
			data: {
				messages: {
					create: {
						role: "USER",
						content: query,
					},
				},
			},
		});

		const previousMessages = await prisma.conversation.findMany({
			where: {
				id: conversationId,
			},
			select: {
				messages: {
					orderBy: {
						createdAt: "desc",
					},
					take: 14,
				},
			},
		});

		const llm = new ChatGoogleGenerativeAI({
			model: "gemini",
			apiKey: process.env.GOOGLE_API_KEY,
		});

		const contextualizeQSystemPrompt =
			"Given a chat history and the latest user question " +
			"which might reference context in the chat history, " +
			"formulate a standalone question which can be understood " +
			"without the chat history. Do NOT answer the question, " +
			"just reformulate it if needed and otherwise return it as is.";

		const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
			["system", contextualizeQSystemPrompt],
			new MessagesPlaceholder("chat_history"),
			["human", "{input}"],
		]);

		const vectorStore = getVectorStore();

		const retriever = vectorStore.asRetriever();

		const historyAwareRetriever = await createHistoryAwareRetriever({
			llm,
			retriever,
			rephrasePrompt: contextualizeQPrompt,
		});

		const systemPrompt =
			"You are an assistant for question-answering tasks. " +
			"Use the following pieces of retrieved context to answer " +
			"the question." +
			"\n\n" +
			"{context}";

		const qaPrompt = ChatPromptTemplate.fromMessages([
			["system", systemPrompt],
			new MessagesPlaceholder("chat_history"),
			["human", "{input}"],
		]);

		const questionAnswerChain = await createStuffDocumentsChain({
			llm,
			prompt: qaPrompt,
		});

		const ragChain = await createRetrievalChain({
			retriever: historyAwareRetriever,
			combineDocsChain: questionAnswerChain,
		});

		const history = previousMessages[0]?.messages.map((msg) => {
			return msg.role === "USER"
				? new HumanMessage(msg.content)
				: new AIMessage(msg.content);
		});

		console.log("HISTORY: ", history);

		const response = await ragChain.stream({
			input: query,
			chat_history: history,
		});

		const responseStream = new Readable({
			async read() {
				for await (const chunk of response) {
					if (chunk.answer) {
						this.push(`data: ${JSON.stringify({ content: chunk.answer })}\n`);
					}
				}
				this.push(null);
			},
		});

		return responseStream;
	} catch (error) {
		console.log(error);
		throw error;
	}
}
