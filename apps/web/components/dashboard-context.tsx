import { authClient } from "@/lib/auth-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { ChevronRight, FileText, MessageSquare, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Document type definition
interface Document {
	id: string;
	name: string;
	type: "pdf" | "docx" | "ppt" | "txt" | "youtube";
	progress: number;
}

const DocumentCard = ({
	document,
	onOpen,
}: { document: Document; onOpen: (id: string) => void }) => {
	const getTypeIcon = (type: string) => {
		switch (type) {
			case "pdf":
				return <FileText size={16} className="text-red-500" />;
			case "youtube":
				return <MessageSquare size={16} className="text-red-500" />;
			default:
				return <FileText size={16} className="text-blue-500" />;
		}
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	return (
		<Card className="group hover:border-primary transition-all duration-200">
			<CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
				<div className="flex items-center space-x-2">
					{getTypeIcon(document.type)}
					<CardTitle className="text-md font-medium truncate max-w-[200px]">
						{document.name}
					</CardTitle>
				</div>
				<Badge variant="outline" className="text-xs">
					{document.type.toUpperCase()}
				</Badge>
			</CardHeader>
			<CardFooter className="p-4 pt-0 flex justify-end">
				<Button
					variant="ghost"
					size="sm"
					className="text-primary group-hover:bg-primary/10"
					onClick={() => onOpen(document.id)}
				>
					Continue <ChevronRight size={16} className="ml-1" />
				</Button>
			</CardFooter>
		</Card>
	);
};

const DashboardContent = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");

	const recentDocuments: Document[] = [
		{
			id: "1",
			name: "Machine Learning Fundamentals.pdf",
			type: "pdf",
			progress: 67,
		},
		{
			id: "2",
			name: "Neural Networks and Deep Learning.pdf",
			type: "pdf",
			progress: 33,
		},
		{
			id: "3",
			name: "Introduction to Algorithms.pdf",
			type: "pdf",
			progress: 89,
		},
		{
			id: "4",
			name: "Stanford CS231n: Convolutional Neural Networks",
			type: "youtube",
			progress: 45,
		},
		{
			id: "5",
			name: "Data Structures Notes.pdf",
			type: "pdf",
			progress: 100,
		},
		{
			id: "6",
			name: "Quantum Computing Introduction.pdf",
			type: "pdf",
			progress: 22,
		},
	];

	const filteredDocuments = recentDocuments.filter((doc) =>
		doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Handle starting a new chat session
	const handleStartNewChat = () => {
		router.push("/document-chat");
	};

	const handleOpenDocument = (documentId: string) => {
		// In a real app, you would pass the document ID to load the specific document chat
		router.push("/document-chat");
	};

	const handleUploadDocument = () => {
		const el = document.createElement("input");
		// accept multiple files
		el.setAttribute("type", "file");
		el.toggleAttribute("multiple", true);
		el.setAttribute(
			"accept",
			"application/pdf, application/vnd.ms-powerpoint, application/msword, text/plain, application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.slideshow, application/vnd.openxmlformats-officedocument.presentationml.presentation",
		);
		el.addEventListener("change", async (e) => {
			e.preventDefault();
			if (el.files && el.files.length > 0) {
				const formData = new FormData();
				[...el.files].forEach((file) => {
					formData.append("files", file);
				});
				console.log("FORM DATA: ", formData);

				await fetch("http://localhost:8080/api/store", {
					method: "POST",
					body: formData,
				});
			}
		});

		el.click();
	};
	const {
		data: session,
		isPending, //loading state
		error, //error object
		refetch, //refetch the session
	} = authClient.useSession();

	if (!session?.user) {
		return null;
	}

	return (
		<div className="p-6 max-w-[1600px] mx-auto">
			<div className="mb-8 flex flex-wrap items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Welcome back, {session.user.name}!
					</h1>
					{/* <p className="text-gray"> */}
					{/* 	Continue your study session or start a new one */}
					{/* </p> */}
				</div>
			</div>

			{/* Quick Upload Section */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle>Quick Upload</CardTitle>
				</CardHeader>
				<CardContent
					// className="p-4 flex flex-col items-center justify-center"
					onDrop={(event) => {
						event.preventDefault();
						const files = event.dataTransfer.files;
						// Handle the uploaded files
					}}
					onDragOver={(event) => event.preventDefault()}
				>
					<div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
						<div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
							<FileText size={20} className="text-primary" />
						</div>
						<p className="text-sm text-gray mb-3">
							Drag and drop your files here or click to browse
						</p>
						<Button
							variant="outline"
							className="text-sm"
							onClick={handleUploadDocument}
						>
							Upload Document
						</Button>
						<div className="text-xs text-gray mt-3">
							Supported formats: PDF, DOCX, PPTX, TXT
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Recent Documents Section */}
			<div className="mb-8 m-4">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold text-foreground">
						Recent Documents
					</h2>
					<div className="relative w-64">
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
							size={16}
						/>
						<Input
							placeholder="Search documents..."
							className="pl-9"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredDocuments.map((document) => (
						<DocumentCard
							key={document.id}
							document={document}
							onOpen={handleOpenDocument}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default DashboardContent;
