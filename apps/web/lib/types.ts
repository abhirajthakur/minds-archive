export type DocumentType = "pdf" | "docx" | "ppt" | "txt";

export interface Document {
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

export interface Message {
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
