"use client";

import { useState } from "react";
import {
	FileText,
	Youtube,
	File,
	MessageSquare,
	Trash2,
	ArrowLeft,
	Upload,
	Clock,
	Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

interface Document {
	id: string;
	name: string;
	type: "pdf" | "docx" | "ppt" | "txt" | "youtube" | "image";
	size?: number;
	url?: string;
	thumbnail?: string;
	dateUploaded: Date;
	processed: boolean;
	error?: string;
}

const Documents = () => {
	const router = useRouter();

	// Mock uploaded documents for demonstration
	const [documents, setDocuments] = useState<Document[]>([
		{
			id: "1",
			name: "Research Paper.pdf",
			type: "pdf",
			size: 2048000,
			dateUploaded: new Date("2024-01-15"),
			processed: true,
		},
		{
			id: "2",
			name: "Meeting Notes.docx",
			type: "docx",
			size: 512000,
			dateUploaded: new Date("2024-01-14"),
			processed: true,
		},
		{
			id: "3",
			name: "Presentation.pptx",
			type: "ppt",
			size: 4096000,
			dateUploaded: new Date("2024-01-13"),
			processed: false,
		},
	]);

	const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

	// Format file size
	const formatFileSize = (bytes?: number) => {
		if (!bytes) return "Unknown size";

		const units = ["B", "KB", "MB", "GB"];
		let size = bytes;
		let unitIndex = 0;

		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}

		return `${size.toFixed(1)} ${units[unitIndex]}`;
	};

	// Format date
	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	// Get icon based on document type
	const getDocumentIcon = (type: Document["type"]) => {
		switch (type) {
			case "pdf":
				return <FileText size={18} className="text-red-500" />;
			case "docx":
				return <File size={18} className="text-blue-500" />;
			case "ppt":
				return <File size={18} className="text-amber-500" />;
			case "txt":
				return <FileText size={18} className="text-gray-500" />;
			case "youtube":
				return <Youtube size={18} className="text-red-500" />;
			default:
				return <File size={18} />;
		}
	};

	// Handle document selection
	const handleDocumentSelect = (documentId: string, checked: boolean) => {
		if (checked) {
			setSelectedDocuments((prev) => [...prev, documentId]);
		} else {
			setSelectedDocuments((prev) => prev.filter((id) => id !== documentId));
		}
	};

	// Handle select all
	const handleSelectAll = () => {
		const processedDocs = documents.filter((doc) => doc.processed);
		if (selectedDocuments.length === processedDocs.length) {
			setSelectedDocuments([]);
		} else {
			setSelectedDocuments(processedDocs.map((doc) => doc.id));
		}
	};

	// Handle chat with selected documents
	const handleChatWithSelected = () => {
		if (selectedDocuments.length === 0) {
			toast.error("No documents selected", {
				description: "Please select at least one document to start chatting.",
			});
			return;
		}

		// Navigate to chat with selected documents
		router.push("/document-chat");
	};

	// Handle document deletion
	const handleDeleteDocument = (documentId: string) => {
		setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
		setSelectedDocuments((prev) => prev.filter((id) => id !== documentId));
		toast("Document deleted", {
			description: "The document has been removed from your library.",
		});
	};

	const processedDocuments = documents.filter((doc) => doc.processed);
	const allProcessedSelected =
		processedDocuments.length > 0 &&
		selectedDocuments.length === processedDocuments.length;

	return (
		<div className="min-h-screen bg-background">
			<div className="p-6 max-w-6xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => router.push("/")}
							className="hover:bg-primary/10"
						>
							<ArrowLeft size={18} />
						</Button>
						<div>
							<h1 className="text-3xl font-bold text-foreground">
								My Documents
							</h1>
							<p className="text-muted-foreground">
								Manage your uploaded documents and start conversations
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-3">
						<Button
							variant="outline"
							onClick={() => router.push("/chat")}
							className="flex items-center space-x-2"
						>
							<Upload size={16} />
							<span>Upload New</span>
						</Button>

						<Button
							onClick={handleChatWithSelected}
							disabled={selectedDocuments.length === 0}
							className="flex items-center space-x-2"
						>
							<MessageSquare size={16} />
							<span>
								Chat with{" "}
								{selectedDocuments.length > 0
									? `${selectedDocuments.length} `
									: ""}
								Selected
							</span>
						</Button>
					</div>
				</div>

				{/* Documents Table */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg">
								Documents ({documents.length})
							</CardTitle>

							{documents.length > 0 && (
								<div className="flex items-center space-x-4">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="select-all"
											checked={allProcessedSelected}
											onCheckedChange={handleSelectAll}
											disabled={processedDocuments.length === 0}
										/>
										<label
											htmlFor="select-all"
											className="text-sm text-muted-foreground cursor-pointer"
										>
											Select all processed
										</label>
									</div>

									<Badge variant="secondary" className="text-xs">
										{selectedDocuments.length} selected
									</Badge>
								</div>
							)}
						</div>
					</CardHeader>

					<CardContent>
						{documents.length === 0 ? (
							<div className="text-center py-12">
								<Upload
									size={48}
									className="mx-auto text-muted-foreground mb-4"
								/>
								<h3 className="text-lg font-medium mb-2">
									No documents uploaded
								</h3>
								<p className="text-muted-foreground mb-4">
									Upload your first document to get started with AI-powered
									conversations
								</p>
								<Button onClick={() => router.push("chat")}>
									Upload Document
								</Button>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-12"></TableHead>
										<TableHead>Name</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Size</TableHead>
										<TableHead>Uploaded</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="w-12"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{documents.map((document) => (
										<TableRow
											key={document.id}
											className={cn(
												"cursor-pointer hover:bg-muted/50",
												selectedDocuments.includes(document.id) &&
													"bg-primary/5 border-primary/20",
											)}
											onClick={() =>
												document.processed &&
												handleDocumentSelect(
													document.id,
													!selectedDocuments.includes(document.id),
												)
											}
										>
											<TableCell>
												<Checkbox
													checked={selectedDocuments.includes(document.id)}
													onCheckedChange={(checked) =>
														handleDocumentSelect(document.id, !!checked)
													}
													disabled={!document.processed}
													onClick={(e) => e.stopPropagation()}
												/>
											</TableCell>

											<TableCell>
												<div className="flex items-center space-x-3">
													{getDocumentIcon(document.type)}
													<span className="font-medium truncate max-w-[300px]">
														{document.name}
													</span>
												</div>
											</TableCell>

											<TableCell>
												<Badge variant="outline" className="text-xs">
													{document.type.toUpperCase()}
												</Badge>
											</TableCell>

											<TableCell className="text-muted-foreground">
												{formatFileSize(document.size)}
											</TableCell>

											<TableCell className="text-muted-foreground">
												{formatDate(document.dateUploaded)}
											</TableCell>

											<TableCell>
												{document.processed ? (
													<div className="flex items-center text-green-600">
														<Check size={14} className="mr-1" />
														<span className="text-xs">Ready</span>
													</div>
												) : document.error ? (
													<div className="flex items-center text-destructive">
														<span className="text-xs">Error</span>
													</div>
												) : (
													<div className="flex items-center text-amber-600">
														<Clock size={14} className="mr-1" />
														<span className="text-xs">Processing</span>
													</div>
												)}
											</TableCell>

											<TableCell>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-destructive hover:text-destructive"
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteDocument(document.id);
													}}
												>
													<Trash2 size={14} />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Documents;
