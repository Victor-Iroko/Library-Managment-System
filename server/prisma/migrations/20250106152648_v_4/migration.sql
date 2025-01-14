-- CreateEnum
CREATE TYPE "resourceEnum" AS ENUM ('book', 'borrowing', 'cart', 'finePayment', 'isbn', 'notification', 'readHistory', 'reservation', 'user');

-- CreateEnum
CREATE TYPE "actionsEnum" AS ENUM ('create', 'read', 'update', 'delete');

-- CreateEnum
CREATE TYPE "conditionEnum" AS ENUM ('theirs', 'all');

-- CreateTable
CREATE TABLE "permissions" (
    "role" "userRole" NOT NULL,
    "actions" "actionsEnum" NOT NULL,
    "resources" "resourceEnum" NOT NULL,
    "fields" TEXT NOT NULL,
    "conditions" "conditionEnum" NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("role")
);
