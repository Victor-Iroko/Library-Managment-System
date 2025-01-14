-- CreateEnum
CREATE TYPE "modelName" AS ENUM ('book', 'borrowing', 'cart', 'finePayment', 'isbn', 'notification', 'readHistory', 'reservation', 'user');

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
