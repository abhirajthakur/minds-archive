"use client";

import {
  AlertCircle,
  CheckCircle,
  File,
  MessageCircle,
  Send,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  type: string;
  content: string;
  timestamp: Date;
};

export default function Page() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    setIsUploading(true);
    setUploadStatus("");

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
        setUploadedDocuments((prev) => [...prev, ...result.documents]);
        setUploadStatus("success");

        // Add a system message about successful upload
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "SYSTEM",
            content: `Successfully uploaded ${selectedFiles.length} file(s). You can now ask questions about the content!`,
            timestamp: new Date(),
          },
        ]);

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) {
      return;
    }

    const currentInputMessage = inputMessage;
    setInputMessage("");
    setIsSending(true);

    try {
      // Create conversation
      const conversationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/conversations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!conversationResponse.ok) {
        throw new Error("Failed to create conversation");
      }

      const conversationResult = await conversationResponse.json();
      const currentConversationId = conversationResult.conversation.id;

      // Associate uploaded documents with the conversation
      if (uploadedDocuments.length > 0) {
        const documentIds = uploadedDocuments.map((doc) => doc.id);

        const associateResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${currentConversationId}/documents`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ documentIds }),
          },
        );

        if (!associateResponse.ok) {
          console.warn("Failed to associate documents with conversation");
        }
      }

// Store the initial message in localStorage and redirect
      localStorage.setItem('initialMessage', currentInputMessage);
      router.push(`/chat/${currentConversationId}`);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "USER",
          content: currentInputMessage,
          timestamp: new Date(),
        },
        {
          id: Date.now() + 1,
          type: "error",
          content:
            "Sorry, there was an error creating the conversation. Please try again.",
          timestamp: new Date(),
        },
      ]);
      setInputMessage(currentInputMessage); // Restore the input message
    } finally {
      setIsSending(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Minds Archive</h1>
                <p className="text-sm text-slate-400">
                  Upload documents and ask questions
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Upload Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Upload Documents
              </h2>

              <div className="space-y-4">
                <div
                  className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer bg-slate-900/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-300 mb-1">
                    {isUploading ? "Uploading..." : "Click to upload files"}
                  </p>
                  <p className="text-xs text-slate-500">
                    PDF, DOC, DOCX, TXT, MD files
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept=".pdf,.doc,.docx,.txt,.md"
                />

                {uploadStatus === "success" && (
                  <div className="flex items-center space-x-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Files uploaded successfully!</span>
                  </div>
                )}

                {uploadStatus === "error" && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Upload failed. Please try again.</span>
                  </div>
                )}
              </div>

              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-white mb-3">
                    Uploaded Files
                  </h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <File className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-300 text-xl mb-2">
                      Ready to help!
                    </p>
                    <p className="text-slate-500">
                      Upload some documents and start asking questions about
                      their content.
                    </p>
                  </div>
                )}

                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.type === "USER" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 ${
                        message.type === "USER"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ml-auto"
                          : message.type === "SYSTEM"
                            ? "bg-green-900/50 text-green-300 border border-green-700 mr-auto"
                            : message.type === "error"
                              ? "bg-red-900/50 text-red-300 border border-red-700 mr-auto"
                              : "bg-slate-700 text-slate-100 border border-slate-600 mr-auto"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          message.type === "USER"
                            ? "text-blue-200"
                            : "text-slate-400"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-700 p-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask a question about your documents..."
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                    disabled={isSending}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isSending}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
