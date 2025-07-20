// "use client";
//
// import {
//   AlertCircle,
//   CheckCircle,
//   File,
//   MessageCircle,
//   Send,
//   Upload,
//   X,
// } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { useCallback, useEffect, useRef, useState } from "react";
// import ReactMarkdown from "react-markdown";
//
// type Message = {
//   id: number;
//   type: string;
//   content: string;
//   timestamp: Date;
// };
//
// export default function ChatPage() {
//   const params = useParams();
//   const router = useRouter();
//   const conversationId = params.id as string;
//
//   const [files, setFiles] = useState<File[]>([]);
//   const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [isSending, setIsSending] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const [isLoadingConversation, setIsLoadingConversation] = useState(true);
//
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
//
//   const handleFileUpload = async (selectedFiles: FileList | null) => {
//     if (!selectedFiles || selectedFiles.length === 0) {
//       return;
//     }
//
//     setIsUploading(true);
//     setUploadStatus("");
//
//     const formData = new FormData();
//     Array.from(selectedFiles).forEach((file) => {
//       formData.append("files", file);
//     });
//
//     try {
//       const response = await fetch("http://localhost:8080/api/store", {
//         method: "POST",
//         body: formData,
//       });
//
//       if (response.ok) {
//         const result = await response.json();
//         // Add new files to display
//         setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
//         setUploadedDocuments((prev) => [...prev, ...result.documents]);
//         setUploadStatus("success");
//
//         // Associate uploaded documents with the conversation
//         if (result.documents.length > 0) {
//           const documentIds = result.documents.map((doc: any) => doc.id);
//
//           const associateResponse = await fetch(
//             `http://localhost:8080/api/conversations/${conversationId}/documents`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ documentIds }),
//             },
//           );
//
//           if (!associateResponse.ok) {
//             console.warn("Failed to associate documents with conversation");
//           }
//         }
//
//         // Add a system message about successful upload
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: Date.now(),
//             type: "SYSTEM",
//             content: `Successfully uploaded ${selectedFiles.length} file(s). You can now ask questions about the content!`,
//             timestamp: new Date(),
//           },
//         ]);
//
//         // Clear the file input
//         if (fileInputRef.current) {
//           fileInputRef.current.value = "";
//         }
//       } else {
//         setUploadStatus("error");
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       setUploadStatus("error");
//     } finally {
//       setIsUploading(false);
//     }
//   };
//
//   const handleSendMessage = useCallback(
//     async (messageToSend?: string) => {
//       const messageContent = messageToSend || inputMessage;
//       if (!messageContent.trim() || isSending) {
//         return;
//       }
//
//       const userMessage = {
//         id: Date.now(),
//         type: "USER",
//         content: messageContent,
//         timestamp: new Date(),
//       };
//
//       setMessages((prev) => [...prev, userMessage]);
//       setInputMessage("");
//       setIsSending(true);
//
//       try {
//         const response = await fetch("http://localhost:8080/api/chat", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             conversationId: conversationId,
//             query: messageContent,
//           }),
//         });
//
//         if (response.ok) {
//           const reader = response.body!.getReader();
//           const decoder = new TextDecoder();
//
//           const aiMessage = {
//             id: Date.now() + 1,
//             type: "ai",
//             content: "",
//             timestamp: new Date(),
//           };
//
//           setMessages((prev) => [...prev, aiMessage]);
//
//           while (true) {
//             const { done, value } = await reader.read();
//             if (done) break;
//
//             const chunk = decoder.decode(value);
//
//             // Process each line that starts with "data: "
//             const lines = chunk.split("\n");
//             for (const line of lines) {
//               if (line.startsWith("data: ")) {
//                 try {
//                   const jsonData = JSON.parse(line.slice(6)); // Remove "data: " prefix
//                   if (jsonData.content) {
//                     setMessages((prev) =>
//                       prev.map((msg) =>
//                         msg.id === aiMessage.id
//                           ? { ...msg, content: msg.content + jsonData.content }
//                           : msg,
//                       ),
//                     );
//                   }
//                 } catch (e) {
//                   // Skip invalid JSON lines
//                   continue;
//                 }
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Chat error:", error);
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: Date.now() + 1,
//             type: "error",
//             content:
//               "Sorry, there was an error processing your message. Please try again.",
//             timestamp: new Date(),
//           },
//         ]);
//       } finally {
//         setIsSending(false);
//       }
//     },
//     [inputMessage, isSending, conversationId],
//   );
//
//   const removeFile = (index: number) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };
//
//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) {
//       return "0 Bytes";
//     }
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };
//
//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };
//
//   // Load conversation from API on mount
//   useEffect(() => {
//     const loadConversation = async () => {
//       try {
//         if (conversationId) {
//           const response = await fetch(
//             `http://localhost:8080/api/conversations/${conversationId}`,
//           );
//
//           if (response.ok) {
//             const data = await response.json();
//             const { conversation } = data;
//
//             // Convert database messages to frontend format
//             const formattedMessages = conversation.messages.map((msg: any) => ({
//               id: parseInt(msg.id.slice(-8), 16), // Use last 8 chars of ID as number
//               type:
//                 msg.role === "USER"
//                   ? "USER"
//                   : msg.role === "SYSTEM"
//                     ? "ai"
//                     : msg.role,
//               content: msg.content,
//               timestamp: new Date(msg.createdAt),
//             }));
//
//             setMessages(formattedMessages);
//
//             // Set uploaded documents from conversation
//             if (conversation.documents.length > 0) {
//               setUploadedDocuments(conversation.documents);
//               // Create file objects for display (size and name only)
//               const fileObjects = conversation.documents.map((doc: any) => ({
//                 name: doc.name,
//                 size: doc.size,
//               }));
//               setFiles(fileObjects);
//             }
//           } else if (response.status === 404) {
//             // Conversation not found, redirect to home
//             router.push("/");
//           }
//         }
//       } catch (error) {
//         console.error("Error loading conversation:", error);
//         router.push("/");
//       } finally {
//         setIsLoadingConversation(false);
//       }
//     };
//
//     loadConversation();
//   }, [conversationId, router]);
//
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
//
//   // Handle initial message from localStorage after conversation loads
//   useEffect(() => {
//     if (!isLoadingConversation && messages.length === 0) {
//       const initialMessage = localStorage.getItem("initialMessage");
//       if (initialMessage) {
//         // Clean up localStorage immediately
//         localStorage.removeItem("initialMessage");
//         // Send the message automatically
//         setTimeout(() => {
//           handleSendMessage(initialMessage);
//         }, 100);
//       }
//     }
//   }, [isLoadingConversation, messages.length, handleSendMessage]);
//
//   if (isLoadingConversation) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
//         <div className="text-white text-xl">Loading conversation...</div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       {/* Header */}
//       <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center h-16">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
//                 <MessageCircle className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-white">Minds Archive</h1>
//                 <p className="text-sm text-slate-400">
//                   Chat ID: {conversationId}
//                 </p>
//               </div>
//             </div>
//             <div className="ml-auto">
//               <button
//                 onClick={() => router.push("/")}
//                 className="text-slate-400 hover:text-white transition-colors"
//               >
//                 New Chat
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>
//
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* File Upload Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
//               <h2 className="text-lg font-semibold text-white mb-4">
//                 Upload Documents
//               </h2>
//
//               <div className="space-y-4">
//                 <div
//                   className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer bg-slate-900/50"
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
//                   <p className="text-sm text-slate-300 mb-1">
//                     {isUploading ? "Uploading..." : "Click to upload files"}
//                   </p>
//                   <p className="text-xs text-slate-500">
//                     PDF, DOC, DOCX, TXT, MD files
//                   </p>
//                 </div>
//
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   multiple
//                   className="hidden"
//                   onChange={(e) => handleFileUpload(e.target.files)}
//                   accept=".pdf,.doc,.docx,.txt,.md"
//                 />
//
//                 {uploadStatus === "success" && (
//                   <div className="flex items-center space-x-2 text-green-400 text-sm">
//                     <CheckCircle className="w-4 h-4" />
//                     <span>Files uploaded successfully!</span>
//                   </div>
//                 )}
//
//                 {uploadStatus === "error" && (
//                   <div className="flex items-center space-x-2 text-red-400 text-sm">
//                     <AlertCircle className="w-4 h-4" />
//                     <span>Upload failed. Please try again.</span>
//                   </div>
//                 )}
//               </div>
//
//               {files.length > 0 && (
//                 <div className="mt-6">
//                   <h3 className="text-sm font-medium text-white mb-3">
//                     Uploaded Files
//                   </h3>
//                   <div className="space-y-2">
//                     {files.map((file, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600"
//                       >
//                         <div className="flex items-center space-x-3 flex-1 min-w-0">
//                           <File className="w-4 h-4 text-slate-400 flex-shrink-0" />
//                           <div className="min-w-0 flex-1">
//                             <p className="text-sm font-medium text-white truncate">
//                               {file.name}
//                             </p>
//                             <p className="text-xs text-slate-400">
//                               {formatFileSize(file.size)}
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => removeFile(index)}
//                           className="text-slate-400 hover:text-red-400 transition-colors"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//
//           {/* Chat Area */}
//           <div className="lg:col-span-2">
//             <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 h-[600px] flex flex-col">
//               {/* Messages */}
//               <div className="flex-1 overflow-y-auto p-6 space-y-4">
//                 {messages.length === 0 && (
//                   <div className="text-center py-12">
//                     <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
//                     <p className="text-slate-300 text-xl mb-2">
//                       Continue your conversation!
//                     </p>
//                     <p className="text-slate-500">
//                       Ask questions about your uploaded documents.
//                     </p>
//                   </div>
//                 )}
//
//                 {messages.map((message, idx) => (
//                   <div
//                     key={idx}
//                     className={`flex ${message.type === "USER" ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`max-w-[80%] rounded-xl px-4 py-3 ${
//                         message.type === "USER"
//                           ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ml-auto"
//                           : message.type === "SYSTEM"
//                             ? "bg-green-900/50 text-green-300 border border-green-700 mr-auto"
//                             : message.type === "error"
//                               ? "bg-red-900/50 text-red-300 border border-red-700 mr-auto"
//                               : "bg-slate-700 text-slate-100 border border-slate-600 mr-auto"
//                       }`}
//                     >
//                       {message.type === "ai" ? (
//                         <div className="text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
//                           <ReactMarkdown>{message.content}</ReactMarkdown>
//                         </div>
//                       ) : (
//                         <p className="text-sm whitespace-pre-wrap leading-relaxed">
//                           {message.content}
//                         </p>
//                       )}
//                       <p
//                         className={`text-xs mt-2 ${
//                           message.type === "USER"
//                             ? "text-blue-200"
//                             : "text-slate-400"
//                         }`}
//                       >
//                         {formatTime(message.timestamp)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//
//                 {isSending && (
//                   <div className="flex justify-start">
//                     <div className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3">
//                       <div className="flex space-x-1">
//                         <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
//                         <div
//                           className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
//                           style={{ animationDelay: "0.1s" }}
//                         />
//                         <div
//                           className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
//                           style={{ animationDelay: "0.2s" }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//
//                 <div ref={messagesEndRef} />
//               </div>
//
//               {/* Input Area */}
//               <div className="border-t border-slate-700 p-4">
//                 <div className="flex space-x-3">
//                   <input
//                     type="text"
//                     value={inputMessage}
//                     onChange={(e) => setInputMessage(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                     placeholder="Ask a question about your documents..."
//                     className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
//                     disabled={isSending}
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!inputMessage.trim() || isSending}
//                     className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 shadow-lg"
//                   >
//                     <Send className="w-4 h-4" />
//                     <span className="hidden sm:inline">Send</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


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
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: 'USER' | 'AI' | 'SYSTEM' | 'ERROR';
  content: string;
  timestamp: Date;
};

type UploadedFile = {
  name: string;
  size: number;
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  // State
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageHandled = useRef(false);
  const conversationLoaded = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize conversation and handle initial message
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get initial message first
        const initialMessage = localStorage.getItem("initialMessage");
        let initialUserMessage: Message | null = null;
        
        if (initialMessage && !initialMessageHandled.current) {
          localStorage.removeItem("initialMessage");
          initialMessageHandled.current = true;
          
          initialUserMessage = {
            id: `initial-${Date.now()}`,
            role: 'USER',
            content: initialMessage,
            timestamp: new Date(),
          };
        }

        // Load existing conversation
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${conversationId}`);
        
        if (response.ok) {
          const { conversation } = await response.json();
          
          // Convert existing messages
          const existingMessages: Message[] = conversation.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.createdAt),
          }));
          
          // Combine existing messages with initial message
          const allMessages = initialUserMessage 
            ? [...existingMessages, initialUserMessage]
            : existingMessages;
          
          setMessages(allMessages);
          
          // Handle file uploads
          if (conversation.documents?.length > 0) {
            const seen = new Set();
            const uniqueDocuments = conversation.documents.filter((doc: any) => {
              if (seen.has(doc.id)) return false;
              seen.add(doc.id);
              return true;
            });
            
            const fileObjects: UploadedFile[] = uniqueDocuments.map((doc: any) => ({
              name: doc.name,
              size: doc.size,
            }));
            setFiles(fileObjects);
          }
          
          conversationLoaded.current = true;
          
          // Send initial message to backend if it exists
          if (initialUserMessage) {
            setTimeout(() => {
              sendMessageToBackend(initialMessage ?? "");
            }, 200);
          }
          
        } else if (response.status === 404) {
          router.push("/");
          return;
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (!conversationLoaded.current) {
      initializeChat();
    }
  }, [conversationId, router]);

  const sendMessageToBackend = async (content: string) => {
    if (isSending) return;
    
    setIsSending(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          query: content,
        }),
      });

      if (response.ok && response.body) {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'AI',
          content: "",
          timestamp: new Date(),
        };

        // Add AI message to state
        setMessages(prev => [...prev, aiMessage]);

        // Stream response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === aiMessage.id
                        ? { ...msg, content: msg.content + data.content }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } else {
        throw new Error('Chat request failed');
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'ERROR',
        content: "Sorry, there was an error processing your message. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const content = messageText || inputMessage.trim();
    if (!content || isSending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'USER',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    
    await sendMessageToBackend(content);
  };

  const uploadFiles = async (selectedFiles: FileList) => {
    setIsUploading(true);
    
    const formData = new FormData();
    Array.from(selectedFiles).forEach(file => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update files list
        const newFiles: UploadedFile[] = Array.from(selectedFiles).map(file => ({
          name: file.name,
          size: file.size,
        }));
        setFiles(prev => [...prev, ...newFiles]);

        // Associate with conversation
        if (result.documents?.length > 0) {
          const documentIds = result.documents.map((doc: any) => doc.id);
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${conversationId}/documents`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documentIds }),
          });
        }

        // Add success message
        setMessages(prev => [...prev, {
          id: `system-${Date.now()}`,
          role: 'SYSTEM',
          content: `Successfully uploaded ${selectedFiles.length} file(s). You can now ask questions about the content!`,
          timestamp: new Date(),
        }]);

        // Clear input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'ERROR',
        content: "Failed to upload files. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getMessageStyles = (role: Message['role']) => {
    switch (role) {
      case 'USER':
        return "bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-auto";
      case 'SYSTEM':
        return "bg-green-900/50 text-green-300 border border-green-700 mr-auto";
      case 'ERROR':
        return "bg-red-900/50 text-red-300 border border-red-700 mr-auto";
      default:
        return "bg-slate-700 text-slate-100 border border-slate-600 mr-auto";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Minds Archive</h1>
                <p className="text-sm text-slate-400">Chat ID: {conversationId}</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="text-slate-400 hover:text-white transition-colors"
            >
              New Chat
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Upload Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Upload Documents</h2>

              <div
                className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer bg-slate-900/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-300 mb-1">
                  {isUploading ? "Uploading..." : "Click to upload files"}
                </p>
                <p className="text-xs text-slate-500">PDF, DOC, DOCX, TXT, MD files</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                accept=".pdf,.doc,.docx,.txt,.md"
                disabled={isUploading}
              />

              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-white mb-3">Uploaded Files</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <File className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
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
                    <p className="text-slate-300 text-xl mb-2">Continue your conversation!</p>
                    <p className="text-slate-500">Ask questions about your uploaded documents.</p>
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-3 ${getMessageStyles(message.role)}`}>
                      {message.role === 'AI' ? (
                        <div className="text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      )}
                      <p className={`text-xs mt-2 ${message.role === 'USER' ? 'text-blue-200' : 'text-slate-400'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
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
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask a question about your documents..."
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                    disabled={isSending}
                  />
                  <button
                    onClick={() => sendMessage()}
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
