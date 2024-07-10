-- CreateEnum
CREATE TYPE "RoleEnumType" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "JournalCategory" AS ENUM ('PERSONAL', 'TRAVEL', 'WORK');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT DEFAULT 'default.png',
    "verified" BOOLEAN DEFAULT false,
    "password" TEXT NOT NULL,
    "role" "RoleEnumType" DEFAULT 'user',
    "provider" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetAt" TIMESTAMP(3),
    "verificationCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" "JournalCategory" NOT NULL,

    CONSTRAINT "journals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationCode_key" ON "users"("verificationCode");

-- CreateIndex
CREATE INDEX "users_email_verificationCode_passwordResetToken_idx" ON "users"("email", "verificationCode", "passwordResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_verificationCode_passwordResetToken_key" ON "users"("email", "verificationCode", "passwordResetToken");
