/*
  Warnings:

  - The values [PERSONAL,TRAVEL,WORK] on the enum `CategoryEnumType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `userId` to the `journals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryEnumType_new" AS ENUM ('personal', 'travel', 'work');
ALTER TABLE "journals" ALTER COLUMN "category" TYPE "CategoryEnumType_new" USING ("category"::text::"CategoryEnumType_new");
ALTER TYPE "CategoryEnumType" RENAME TO "CategoryEnumType_old";
ALTER TYPE "CategoryEnumType_new" RENAME TO "CategoryEnumType";
DROP TYPE "CategoryEnumType_old";
COMMIT;

-- AlterTable
ALTER TABLE "journals" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "journals" ADD CONSTRAINT "journals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
