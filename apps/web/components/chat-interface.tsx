import React from "react";
import {
	User,
	Bot,
	FileText,
	Youtube,
	Loader2,
	Copy,
	CheckCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Button } from "@workspace/ui/components/button";

interface Source {
	documentId: string;
	excerpt: string;
	pageNumber?: number;
}

interface Message {
	id: string;
	content: string;
	sender: "user" | "ai";
	timestamp: Date;
	sources?: Source[];
}

interface Document {
	id: string;
	name: string;
	type: "pdf" | "docx" | "ppt" | "txt" | "youtube" | "image";
	processed: boolean;
}

interface ChatInterfaceProps {
	messages: Message[];
	documents: Document[];
	isProcessing: boolean;
	chatEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatInterface = ({
	messages,
	documents,
	isProcessing,
	chatEndRef,
}: ChatInterfaceProps) => {
	const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

	// Get document by id helper
	const getDocumentById = (id: string) => {
		return documents.find((doc) => doc.id === id);
	};

	// Format timestamp
	const formatTime = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	// Copy message content to clipboard
	const copyMessageContent = (messageId: string, content: string) => {
		navigator.clipboard
			.writeText(content)
			.then(() => {
				setCopiedMessageId(messageId);
				toast("Copied to clipboard", {
					description: "Message content copied successfully",
				});

				// Reset the copied state after 2 seconds
				setTimeout(() => {
					setCopiedMessageId(null);
				}, 2000);
			})
			.catch((err) => {
				toast.error("Failed to copy", {
					description: "Could not copy the message content",
				});
			});
	};

	// Handle empty chat state
	if (messages.length === 0) {
		return (
			<div className="flex-1 flex flex-col items-center justify-center text-center p-8">
				<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
					<Bot size={24} className="text-primary" />
				</div>
				<h3 className="text-lg font-medium">Chat with your documents</h3>
				<p className="text-sm text-muted-foreground mt-2 max-w-md">
					Upload documents, select them, and start asking questions. The AI will
					provide answers based on the content of your selected documents.
				</p>
			</div>
		);
	}

	return (
		<ScrollArea className="flex-1 pr-4">
			<div className="space-y-4 py-4">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} group`}
					>
						<div
							className={`relative rounded-lg p-4 max-w-[85%] ${
								message.sender === "user"
									? "bg-primary text-primary-foreground"
									: "bg-muted"
							}`}
						>
							<div className="flex items-center space-x-2 mb-2">
								<div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
									{message.sender === "user" ? (
										<User size={14} />
									) : (
										<Bot size={14} />
									)}
								</div>
								<span className="text-xs opacity-70">
									{message.sender === "user" ? "You" : "AI Assistant"} •{" "}
									{formatTime(message.timestamp)}
								</span>

								{/* Copy button - appears on hover */}
								<Button
									variant="ghost"
									size="icon"
									className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
									onClick={() =>
										copyMessageContent(message.id, message.content)
									}
								>
									{copiedMessageId === message.id ? (
										<CheckCheck size={14} className="text-green-500" />
									) : (
										<Copy size={14} />
									)}
								</Button>
							</div>

							<div className="text-sm whitespace-pre-wrap">
								{message.content}
							</div>

							{/* Source citations */}
							{message.sources && message.sources.length > 0 && (
								<div className="mt-3 pt-3 border-t border-background/20">
									<div className="text-xs opacity-70 mb-2">Sources:</div>
									<div className="space-y-2">
										{message.sources.map((source, index) => {
											const document = getDocumentById(source.documentId);
											return (
												<div key={index} className="flex items-start space-x-2">
													<div className="mt-0.5">
														{document?.type === "pdf" && (
															<FileText size={14} className="text-red-400" />
														)}
														{document?.type === "youtube" && (
															<Youtube size={14} className="text-red-400" />
														)}
														{!document?.type && <FileText size={14} />}
													</div>
													<div>
														<div className="text-xs font-medium">
															{document?.name || "Document"}
															{source.pageNumber &&
																` (p. ${source.pageNumber})`}
														</div>
														<div className="text-xs mt-1 opacity-90 bg-background/20 p-2 rounded">
															{source.excerpt}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							)}
						</div>
					</div>
				))}

				{/* Show loading indicator when processing */}
				{isProcessing && (
					<div className="flex justify-start">
						<div className="rounded-lg p-4 bg-muted">
							<div className="flex items-center space-x-2">
								<div className="flex space-x-1">
									<div
										className="w-2 h-2 rounded-full bg-primary animate-bounce"
										style={{ animationDelay: "0ms" }}
									></div>
									<div
										className="w-2 h-2 rounded-full bg-primary animate-bounce"
										style={{ animationDelay: "150ms" }}
									></div>
									<div
										className="w-2 h-2 rounded-full bg-primary animate-bounce"
										style={{ animationDelay: "300ms" }}
									></div>
								</div>
								<span className="text-sm">AI is analyzing documents...</span>
							</div>
						</div>
					</div>
				)}

				{/* Invisible element for auto-scrolling */}
				<div ref={chatEndRef} />
			</div>
		</ScrollArea>
	);
};

export default ChatInterface;
