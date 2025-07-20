# Minds Archive

A modern **RAG (Retrieval-Augmented Generation)** application built with Next.js, Express, and LangChain that allows users to upload documents and query their content using AI-powered natural language processing.

## 🚀 Features

### Frontend (Next.js)

- **Document Upload**: Support for PDF, DOC, DOCX, TXT, and MD files
- **Real-time Chat Interface**: Interactive chat to query uploaded documents

### Backend (Express + LangChain)

- **RAG Architecture**: Retrieval-Augmented Generation for accurate document querying
- **LangChain Integration**: Powered by LangChain for document processing and retrieval
- **Vector Storage**: Uses PostgreSQL with pgvector for efficient similarity search
- **Google Generative AI**: Leverages Google's Gemini model for embeddings and chat responses
- **Document Processing**: Intelligent text chunking and embedding generation
- **Conversation History**: Maintains chat context for better responses

### Database & Infrastructure

- **PostgreSQL with pgvector**: Vector database for semantic search
- **Prisma ORM**: Type-safe database operations
- **Monorepo Architecture**: Organized with Turborepo for efficient development

## 🛠 Technology Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Express.js, LangChain, Google Generative AI
- **Database**: PostgreSQL with pgvector extension
- **ORM**: Prisma

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/abhirajthakur/minds-archive.git
cd minds-archive
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/minds_archive"

# Google AI API Key
GOOGLE_API_KEY="your-google-ai-api-key"

# Server Configuration
PORT=8080
```

### 4. Start the Database

```bash
cd packages/database
docker-compose up -d
```

### 5. Run Database Migrations

```bash
pnpm db:migrate
```

### 6. Start Development Servers

```bash
pnpm dev
```

This will start:

- Web app: http://localhost:3000
- API server: http://localhost:8080

## 🤖 How RAG Works in This Application

1. **Document Upload**: Users upload documents through the web interface
2. **Text Extraction**: LangChain loaders extract text from various file formats
3. **Chunking**: Documents are split into semantic chunks using RecursiveCharacterTextSplitter
4. **Embedding Generation**: Google's embedding model creates vector representations
5. **Vector Storage**: Embeddings are stored in PostgreSQL with pgvector
6. **Query Processing**: User questions are embedded and used for similarity search
7. **Context Retrieval**: Relevant document chunks are retrieved based on similarity
8. **Response Generation**: Gemini model generates responses using retrieved context

## 📚 LangChain Integration

The application uses several LangChain components:

- **Document Loaders**: PDFLoader, DocxLoader, PPTXLoader, TextLoader
- **Text Splitters**: RecursiveCharacterTextSplitter for intelligent chunking
- **Vector Stores**: PrismaVectorStore for PostgreSQL integration
- **Embeddings**: GoogleGenerativeAIEmbeddings for text vectorization
- **Chains**: RetrievalChain and StuffDocumentsChain for RAG pipeline
- **Chat Models**: ChatGoogleGenerativeAI for conversational responses
