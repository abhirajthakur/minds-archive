-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_conversationId_fkey";

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "conversationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
