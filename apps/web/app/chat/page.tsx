"use client";

import ChatInterface from "@/components/chat-interface";
import ChatNavbar from "@/components/chat-navbar";
import FileUploadLoading from "@/components/file-upload-loading";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import {
	File,
	FileText,
	HelpCircle,
	Loader2,
	Paperclip,
	Send,
	X,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Type definitions for our documents and messages
type DocumentType = "pdf" | "docx" | "ppt" | "txt";

interface Document {
	id: string;
	name: string;
	type: DocumentType;
	size?: number;
	url?: string;
	thumbnail?: string;
	dateUploaded: Date;
	processed: boolean;
	error?: string;
	content?: string;
}

interface Message {
	id: string;
	content: string;
	sender: "user" | "ai";
	timestamp: Date;
	sources?: {
		documentId: string;
		excerpt: string;
		pageNumber?: number;
	}[];
}

const DocumentChat = () => {
	const [documents, setDocuments] = useState<Document[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [activeDocumentIds, setActiveDocumentIds] = useState<string[]>([]);
	const [userInput, setUserInput] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [uploadProgress, setUploadProgress] = useState({
		uploaded: 0,
		total: 0,
	});
	const [isUploading, setIsUploading] = useState(false);
	const chatEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const params = useParams<{ chatId: string }>();

	// Generate a new chat ID
	const generateChatId = () => {
		return (
			"chat_" +
			Date.now().toString() +
			"_" +
			Math.random().toString(36).substr(2, 9)
		);
	};

	// Scroll to bottom of chat when new messages are added
	useEffect(() => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	// Handle global drag and drop events
	useEffect(() => {
		const handleDragOver = (e: DragEvent) => {
			e.preventDefault();
			setIsDragging(true);
		};

		const handleDragLeave = (e: DragEvent) => {
			// Only hide if we're actually leaving the window
			if (!e.relatedTarget) {
				setIsDragging(false);
			}
		};

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			setIsDragging(false);

			if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
				handleFileInputChange({
					target: { files: e.dataTransfer.files },
				} as any);
			}
		};

		document.addEventListener("dragover", handleDragOver);
		document.addEventListener("dragleave", handleDragLeave);
		document.addEventListener("drop", handleDrop);

		return () => {
			document.removeEventListener("dragover", handleDragOver);
			document.removeEventListener("dragleave", handleDragLeave);
			document.removeEventListener("drop", handleDrop);
		};
	}, []);

	// Handle file upload completion
	const handleUploadComplete = (newDoc: Document) => {
		setDocuments((prev) => [...prev, newDoc]);
		toast("Document uploaded successfully", {
			description: `${newDoc.name} has been added to your library.`,
		});
		// Auto-select first document for better UX
		if (documents.length === 0) {
			setActiveDocumentIds([newDoc.id]);
		}
	};

	// Handle file selection via input
	// const handleFileInputChange = async (
	// 	e: React.ChangeEvent<HTMLInputElement>,
	// ) => {
	const handleFileInputChange = async (
		e: React.ChangeEvent<HTMLInputElement> | { target: { files: FileList } },
	) => {
		if (e.target.files && e.target.files.length > 0) {
			const files = e.target.files;
			setIsUploading(true);
			setUploadProgress({ uploaded: 0, total: files.length });

			try {
				// Prepare FormData
				const formData = new FormData();
				[...files].forEach((file) => {
					formData.append("files", file);
				});
				console.log("FORM DATA: ", formData);

				// Upload to backend
				const response = await fetch("http://localhost:8080/api/store", {
					method: "POST",
					body: formData,
				});

				if (response.ok) {
					console.log(response);

					// Create document objects for each uploaded file
					const newDocuments = Array.from(files).map((file) => ({
						id: Date.now().toString() + Math.random(),
						name: file.name,
						type: getDocumentType(file),
						size: file.size,
						dateUploaded: new Date(),
						processed: true, // Mark as processed since upload was successful
					}));

					// Add all documents to state
					setDocuments((prev) => [...prev, ...newDocuments]);

					setUploadProgress({ uploaded: files.length, total: files.length });

					// Auto-select documents if none are currently selected
					if (activeDocumentIds.length === 0) {
						setActiveDocumentIds(newDocuments.map((doc) => doc.id));
					}

					toast("Documents uploaded successfully", {
						description: `${files.length} ${files.length === 1 ? "file" : "files"} uploaded successfully.`,
					});
				} else {
					throw new Error("Upload failed");
				}
			} catch (err) {
				console.error("Error while uploading the files", err);
				toast.error("Upload failed", {
					description:
						"There was an error uploading your files. Please try again.",
				});
			} finally {
				setIsUploading(false);
				setUploadProgress({ uploaded: 0, total: 0 });
			}
		}
	};

	// Get document type helper
	const getDocumentType = (file: File): DocumentType => {
		if (file.type === "application/pdf") return "pdf";
		if (
			file.type ===
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		)
			return "docx";
		if (
			file.type ===
			"application/vnd.openxmlformats-officedocument.presentationml.presentation"
		)
			return "ppt";
		if (file.type === "text/plain") return "txt";
		return "pdf";
	};

	// Handle sending a message
	const handleSendMessage = async () => {
		if (!userInput.trim() || activeDocumentIds.length === 0) {
			if (activeDocumentIds.length === 0) {
				toast.error("Select documents first", {
					description: "Please select at least one document to start chatting.",
				});
			}
			return;
		}

		// Add user message
		const userMessage: Message = {
			id: Date.now().toString(),
			content: userInput,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setUserInput("");
		setIsProcessing(true);

		if (messages.length === 0 && !params.chatId) {
			const newChatId = generateChatId();
			router.replace(`/chat/${newChatId}`);
		}

		// Simulate AI processing and response
		setTimeout(() => {
			// Get active documents
			const activeDocuments = documents.filter(
				(doc) => activeDocumentIds.includes(doc.id) && doc.processed,
			);

			if (activeDocuments.length === 0) {
				toast.error("No processed documents", {
					description: "Please wait for your documents to finish processing.",
				});
				setIsProcessing(false);
				return;
			}

			// Simulate finding sources from the documents
			const sources = activeDocuments
				.slice(0, Math.min(2, activeDocuments.length))
				.map((doc) => ({
					documentId: doc.id,
					excerpt: `Excerpt from ${doc.name}...`,
					pageNumber: Math.floor(Math.random() * 10) + 1,
				}));

			// Create AI response with sources
			const aiResponse: Message = {
				id: Date.now().toString(),
				content: `Here's information based on your uploaded documents about "${userInput}"...`,
				sender: "ai",
				timestamp: new Date(),
				sources,
			};

			setMessages((prev) => [...prev, aiResponse]);
			setIsProcessing(false);
		}, 2000);
	};

	// Sample questions based on document types
	const getSampleQuestions = () => {
		const docTypes = [
			...new Set(
				documents
					.filter((doc) => activeDocumentIds.includes(doc.id))
					.map((doc) => doc.type),
			),
		];

		if (docTypes.includes("pdf") || docTypes.includes("docx")) {
			return [
				"What are the main points in this document?",
				"Can you summarize the key findings?",
				"What recommendations are mentioned?",
			];
		}

		return [
			"What is this document about?",
			"Can you explain the main concepts?",
			"What are the important details?",
		];
	};

	// Toggle a document's active state
	const toggleDocumentActive = (docId: string) => {
		setActiveDocumentIds((prev) =>
			prev.includes(docId)
				? prev.filter((id) => id !== docId)
				: [...prev, docId],
		);
	};

	// Remove a document
	const removeDocument = (docId: string) => {
		setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
		setActiveDocumentIds((prev) => prev.filter((id) => id !== docId));
	};

	// Quick action to ask a sample question
	const askSampleQuestion = (question: string) => {
		setUserInput(question);
	};

	// Get document icon
	const getDocumentIcon = (type: DocumentType) => {
		switch (type) {
			case "pdf":
				return <FileText size={16} className="text-red-500" />;
			case "docx":
				return <File size={16} className="text-blue-500" />;
			default:
				return <File size={16} />;
		}
	};

	return (
		// <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">

		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col relative">
			{/* Global drag and drop overlay */}
			{isDragging && (
				<div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center">
					<div className="bg-background border-2 border-dashed border-primary rounded-lg p-8 text-center">
						<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
							<Paperclip size={32} className="text-primary" />
						</div>
						<h3 className="text-lg font-semibold mb-2">Drop files to upload</h3>
						<p className="text-muted-foreground">
							Supported formats: PDF, DOCX, PPTX, TXT, images
						</p>
					</div>
				</div>
			)}
			<ChatNavbar
				documentCount={documents.length}
				activeDocumentCount={activeDocumentIds.length}
			/>

			<div className="flex-1 flex flex-col items-center p-6 max-w-4xl mx-auto w-full">
				<FileUploadLoading
					isUploading={isUploading}
					fileCount={uploadProgress.total}
					uploadedCount={uploadProgress.uploaded}
				/>
				{/* Active Documents Bar */}
				{documents.length > 0 && (
					<Card
						className={`mb-6 bg-background/50 backdrop-blur-sm w-full ${isUploading ? "mt-4" : ""}`}
					>
						<CardContent className="p-4">
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-sm font-semibold">
									Active Documents ({activeDocumentIds.length})
								</h3>
								{documents.length > 0 && (
									<div className="flex space-x-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												setActiveDocumentIds(
													documents.filter((d) => d.processed).map((d) => d.id),
												)
											}
											className="text-xs h-7"
										>
											Select All
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setActiveDocumentIds([])}
											className="text-xs h-7"
										>
											Clear All
										</Button>
									</div>
								)}
							</div>

							<div className="flex flex-wrap gap-2">
								{documents.map((doc) => (
									<Button
										key={doc.id}
										variant={
											activeDocumentIds.includes(doc.id) ? "default" : "outline"
										}
										size="sm"
										className="h-auto py-2 px-3 flex items-center space-x-2"
										onClick={() => toggleDocumentActive(doc.id)}
										disabled={!doc.processed}
									>
										{getDocumentIcon(doc.type)}
										<span className="text-xs max-w-[120px] truncate">
											{doc.name}
										</span>
										{!doc.processed && (
											<Loader2 size={12} className="animate-spin ml-1" />
										)}
										{activeDocumentIds.includes(doc.id) && (
											<X
												size={12}
												className="ml-1 hover:bg-background/20 rounded-full p-0.5"
												onClick={(e) => {
													e.stopPropagation();
													removeDocument(doc.id);
												}}
											/>
										)}
									</Button>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Main Chat Area */}
				<Card className="flex-1 flex flex-col border-0 bg-background/50 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden w-full">
					<CardContent className="p-0 flex-1 flex flex-col h-full">
						<div className="flex-1 overflow-hidden">
							<ChatInterface
								messages={messages}
								documents={documents}
								isProcessing={isProcessing}
								chatEndRef={chatEndRef}
							/>
						</div>

						{/* Sample questions when no messages */}
						{messages.length === 0 && activeDocumentIds.length > 0 && (
							<div className="p-6 border-t bg-gradient-to-r from-background to-muted/10">
								<div className="mb-3">
									<h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
										<HelpCircle size={16} className="text-primary" />
										<span>Try asking:</span>
									</h4>
									<div className="flex flex-wrap gap-2">
										{getSampleQuestions().map((question, index) => (
											<Button
												key={index}
												variant="outline"
												size="sm"
												className="text-xs h-8 bg-background/50 hover:bg-primary/10 hover:border-primary/30"
												onClick={() => askSampleQuestion(question)}
											>
												{question}
											</Button>
										))}
									</div>
								</div>
							</div>
						)}

						{/* Centered Input Area */}
						<div className="p-6 border-t bg-background/80 backdrop-blur-sm">
							<div className="max-w-3xl mx-auto">
								<div className="flex items-end space-x-3">
									<div className="flex-1 relative">
										<Textarea
											placeholder={
												documents.length === 0
													? // ? "Upload documents using the attachment button, then ask questions..."
														"Upload documents using the attachment button or drag & drop files, then ask questions..."
													: activeDocumentIds.length === 0
														? "Select documents above, then ask questions..."
														: documents
																	.filter((d) =>
																		activeDocumentIds.includes(d.id),
																	)
																	.some((d) => !d.processed)
															? "Documents are still processing..."
															: "Ask something about your documents..."
											}
											className="min-h-[60px] resize-none border-2 border-muted focus:border-primary/50 rounded-xl bg-background/50 backdrop-blur-sm transition-all duration-200 pl-12 pr-16"
											value={userInput}
											onChange={(e) => setUserInput(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter" && !e.shiftKey) {
													e.preventDefault();
													handleSendMessage();
												}
											}}
											disabled={isUploading}
										/>
										{/* Attachment Button */}
										<Button
											variant="ghost"
											size="icon"
											className="absolute left-3 top-3 h-8 w-8 hover:bg-primary/10"
											onClick={() => fileInputRef.current?.click()}
										>
											<Paperclip size={16} />
										</Button>
										<div className="absolute bottom-3 right-3 flex items-center space-x-1">
											<span className="text-xs text-muted-foreground">
												{userInput.length}/1000
											</span>
										</div>
									</div>
									<Button
										onClick={handleSendMessage}
										disabled={
											isProcessing ||
											!userInput.trim() ||
											activeDocumentIds.length === 0 ||
											isUploading
										}
										className="h-[60px] px-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
									>
										{isProcessing ? (
											<Loader2 className="animate-spin" size={20} />
										) : (
											<Send size={20} />
										)}
									</Button>
								</div>

								{/* Hidden file input */}
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileInputChange}
									multiple
									accept=".pdf,.docx,.pptx,.txt,.png,.jpg,.jpeg"
									className="hidden"
								/>

								{/* Centered Status Indicator */}
								<div className="mt-4 flex items-center justify-between">
									<div className="flex items-center space-x-4">
										{isUploading ? (
											<div className="flex items-center space-x-2 text-blue-600 bg-blue-50 dark:bg-blue-950/20 px-3 py-2 rounded-full text-sm">
												<Loader2 className="w-4 h-4 animate-spin" />
												<span>
													Uploading {uploadProgress.uploaded}/
													{uploadProgress.total} files...
												</span>
											</div>
										) : documents.length === 0 ? (
											<div className="flex items-center space-x-2 text-blue-600 bg-blue-50 dark:bg-blue-950/20 px-3 py-2 rounded-full text-sm">
												<Paperclip className="w-4 h-4" />
												<span>
													Click the attachment button to upload documents
												</span>
											</div>
										) : activeDocumentIds.length === 0 ? (
											<div className="flex items-center space-x-2 text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 rounded-full text-sm">
												<div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
												<span>Select documents above to start chatting</span>
											</div>
										) : documents
												.filter((d) => activeDocumentIds.includes(d.id))
												.some((d) => !d.processed) ? (
											<div className="flex items-center space-x-2 text-blue-600 bg-blue-50 dark:bg-blue-950/20 px-3 py-2 rounded-full text-sm">
												<Loader2 className="w-4 h-4 animate-spin" />
												<span>Processing documents...</span>
											</div>
										) : isProcessing ? (
											<div className="flex items-center space-x-2 text-blue-600 bg-blue-50 dark:bg-blue-950/20 px-3 py-2 rounded-full text-sm">
												<Loader2 className="w-4 h-4 animate-spin" />
												<span>AI is thinking...</span>
											</div>
										) : (
											<div className="flex items-center space-x-2 text-green-600 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-full text-sm">
												<div className="w-2 h-2 rounded-full bg-green-400"></div>
												<span>
													Ready • {activeDocumentIds.length}{" "}
													{activeDocumentIds.length === 1
														? "document"
														: "documents"}
												</span>
											</div>
										)}
									</div>

									<div className="text-xs text-muted-foreground">
										Press Enter to send, Shift+Enter for new line
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default DocumentChat;

