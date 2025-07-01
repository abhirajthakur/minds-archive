import { Button } from "@workspace/ui/components/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
	Check,
	Clock,
	File,
	FileText,
	FileUp,
	MessageSquare,
	Trash2,
	Youtube,
} from "lucide-react";

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

interface DocumentListProps {
	documents: Document[];
	activeDocumentIds: string[];
	onToggleActive: (id: string) => void;
	onRemove: (id: string) => void;
}

const DocumentList = ({
	documents,
	activeDocumentIds,
	onToggleActive,
	onRemove,
}: DocumentListProps) => {
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
				return <FileUp size={18} className="text-amber-500" />;
			case "txt":
				return <FileText size={18} className="text-gray-500" />;
			case "youtube":
				return <Youtube size={18} className="text-red-500" />;
			default:
				return <File size={18} />;
		}
	};

	// If there are no documents
	if (documents.length === 0) {
		return (
			<div className="text-center py-8">
				<FileUp size={24} className="mx-auto text-muted-foreground mb-2" />
				<p className="text-sm text-muted-foreground">
					No documents uploaded yet
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{documents.map((doc) => (
				<div
					key={doc.id}
					className={`border rounded-lg p-3 transition-all ${
						activeDocumentIds.includes(doc.id)
							? "border-primary bg-primary/5"
							: "border-border hover:border-muted"
					}`}
				>
					<div className="flex items-start justify-between">
						<div className="flex items-start space-x-3">
							{/* Document icon/thumbnail */}
							<div className="flex-shrink-0">
								{doc.thumbnail ? (
									<img
										src={doc.thumbnail}
										alt={doc.name}
										className="w-10 h-10 object-cover rounded-md"
									/>
								) : (
									<div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
										{getDocumentIcon(doc.type)}
									</div>
								)}
							</div>

							{/* Document info */}
							<div className="flex-1 min-w-0">
								<h4 className="text-sm font-medium truncate">{doc.name}</h4>
								<div className="flex items-center space-x-2 mt-1">
									<span className="text-xs text-muted-foreground">
										{formatDate(doc.dateUploaded)}
									</span>
									{doc.size && (
										<>
											<span className="text-xs text-muted-foreground">•</span>
											<span className="text-xs text-muted-foreground">
												{formatFileSize(doc.size)}
											</span>
										</>
									)}
								</div>

								{/* Status indicator */}
								<div className="flex items-center mt-1">
									{doc.processed ? (
										<div className="flex items-center text-xs text-green-500">
											<Check size={12} className="mr-1" />
											Ready
										</div>
									) : doc.error ? (
										<div className="flex items-center text-xs text-destructive">
											<span className="mr-1">!</span>
											Error: {doc.error}
										</div>
									) : (
										<div className="flex items-center text-xs text-amber-500">
											<Clock size={12} className="mr-1 animate-pulse" />
											Processing...
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="flex items-center space-x-1">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className={`h-8 w-8 ${activeDocumentIds.includes(doc.id) ? "text-primary" : ""}`}
											onClick={() => onToggleActive(doc.id)}
											disabled={!doc.processed}
										>
											<MessageSquare size={16} />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>
											{activeDocumentIds.includes(doc.id)
												? "Remove from chat"
												: "Add to chat"}
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-destructive hover:text-destructive"
											onClick={() => onRemove(doc.id)}
										>
											<Trash2 size={16} />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Delete document</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default DocumentList;
