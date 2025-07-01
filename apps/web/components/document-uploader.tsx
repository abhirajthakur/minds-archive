"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Progress } from "@workspace/ui/components/progress";
import { FileUp, Paperclip, Youtube } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface DocumentUploaderProps {
	onUploadComplete: (document: {
		id: string;
		name: string;
		type: "pdf" | "docx" | "ppt" | "txt" | "youtube" | "image";
		size?: number;
		url?: string;
		thumbnail?: string;
		dateUploaded: Date;
		processed: boolean;
	}) => void;
}

const DocumentUploader = ({ onUploadComplete }: DocumentUploaderProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [youtubeUrl, setYoutubeUrl] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Handle drag events
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	// Validate file type
	const validateFileType = (file: File) => {
		const validTypes = [
			"application/pdf",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/vnd.openxmlformats-officedocument.presentationml.presentation",
			"text/plain",
		];
		return validTypes.includes(file.type);
	};

	// Get document type based on file type
	const getDocumentType = (
		file: File,
	): "pdf" | "docx" | "ppt" | "txt" | "image" => {
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
		if (file.type.startsWith("image/")) return "image";
		return "pdf"; // Default fallback
	};

	// Handle file drop
	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files.length > 0) {
			handleFileUpload(files);
		}
	};

	// Handle file selection via input
	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			handleFileUpload(e.target.files);
		}
	};

	// Process file upload
	const handleFileUpload = (files: FileList) => {
		// Convert FileList to array for easier processing
		const fileArray = Array.from(files);

		// Filter out invalid file types
		const validFiles = fileArray.filter(validateFileType);
		const invalidFiles = fileArray.filter((file) => !validateFileType(file));

		if (invalidFiles.length > 0) {
			toast.error(
				`${invalidFiles.length} files were skipped. Supported formats: PDF, DOCX, PPT, TXT, images`,
				{
					description: "Invalid file format",
				},
			);
		}

		if (validFiles.length === 0) return;

		// Process each valid file
		validFiles.forEach((file) => {
			// Simulate upload process
			setIsUploading(true);
			setUploadProgress(0);

			const uploadInterval = setInterval(() => {
				setUploadProgress((prev) => {
					const newProgress = prev + 10;
					if (newProgress >= 100) {
						clearInterval(uploadInterval);
						setIsUploading(false);

						// Create document object
						const newDocument = {
							id: Date.now().toString(),
							name: file.name,
							type: getDocumentType(file),
							size: file.size,
							dateUploaded: new Date(),
							processed: false,
						};

						// Pass to parent component
						onUploadComplete(newDocument);

						return 0;
					}
					return newProgress;
				});
			}, 200);
		});
	};

	// Validate YouTube URL
	const validateYoutubeUrl = (url: string) => {
		const youtubeRegex =
			/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
		return youtubeRegex.test(url);
	};

	// Handle YouTube URL submission
	const handleYoutubeSubmit = () => {
		if (!validateYoutubeUrl(youtubeUrl)) {
			toast.error("Please enter a valid YouTube URL", {
				description: "Invalid YouTube URL",
			});
			return;
		}

		setIsUploading(true);
		setUploadProgress(0);

		// Simulate upload/processing
		const uploadInterval = setInterval(() => {
			setUploadProgress((prev) => {
				const newProgress = prev + 10;
				if (newProgress >= 100) {
					clearInterval(uploadInterval);
					setIsUploading(false);

					const videoId = youtubeUrl.includes("v=")
						? // @ts-ignore
							youtubeUrl.split("v=")[1].split("&")[0]
						: youtubeUrl.split("/").pop();

					// Create document object
					const newDocument = {
						id: Date.now().toString(),
						name: `YouTube Video - ${new Date().toLocaleDateString()}`,
						type: "youtube" as const,
						url: youtubeUrl,
						thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
						dateUploaded: new Date(),
						processed: false,
					};

					// Pass to parent component
					onUploadComplete(newDocument);
					setYoutubeUrl("");

					return 0;
				}
				return newProgress;
			});
		}, 200);
	};

	return (
		<div className="space-y-4">
			{/* File upload area */}
			<div
				className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer hover:bg-muted/50 ${
					isDragging ? "border-primary bg-primary/10" : "border-border"
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={() => fileInputRef.current?.click()}
			>
				<div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
					<FileUp size={20} className="text-primary" />
				</div>
				<p className="text-sm text-gray mb-2">
					Drag and drop your files here or click to browse
				</p>
				<p className="text-xs text-muted-foreground mb-4">
					Supported formats: PDF, DOCX, PPTX, TXT, images
				</p>
				<Button variant="outline" size="sm" className="pointer-events-none">
					<Paperclip size={16} className="mr-2" />
					Select Files
				</Button>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileInputChange}
					multiple
					accept=".pdf,.docx,.pptx,.txt,.png,.jpg,.jpeg"
					className="hidden"
				/>
			</div>

			{/* YouTube URL input */}
			<div className="border rounded-lg p-4">
				<h3 className="text-sm font-medium mb-2">Add YouTube Video</h3>
				<div className="flex space-x-2">
					<div className="flex-1">
						<Input
							placeholder="Paste YouTube URL here"
							value={youtubeUrl}
							onChange={(e) => setYoutubeUrl(e.target.value)}
							disabled={isUploading}
						/>
					</div>
					<Button
						onClick={handleYoutubeSubmit}
						disabled={!youtubeUrl || isUploading}
						size="icon"
					>
						<Youtube size={18} />
					</Button>
				</div>
			</div>

			{/* Upload progress */}
			{isUploading && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm">Uploading...</span>
						<span className="text-sm font-medium">{uploadProgress}%</span>
					</div>
					<Progress value={uploadProgress} className="h-2" />
				</div>
			)}
		</div>
	);
};

export default DocumentUploader;
