-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('ADMIN', 'LIBRARIAN', 'USER');

-- CreateEnum
CREATE TYPE "genreEnum" AS ENUM ('Fiction', 'Non_Fiction', 'Science_Fiction', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Biography', 'Historical', 'Self_Help');

-- CreateEnum
CREATE TYPE "reservationStatusEnum" AS ENUM ('Collected', 'Not_collected');

-- CreateEnum
CREATE TYPE "notificationType" AS ENUM ('DUE_DATE', 'FINE', 'RESERVATION');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT,
    "role" "userRole" NOT NULL DEFAULT 'USER',
    "refreshToken" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genre" "genreEnum" NOT NULL,
    "available_copies" INTEGER NOT NULL DEFAULT 0,
    "avg_rating" DOUBLE PRECISION,
    "publication_year" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "cover_image" TEXT,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "isbn" (
    "isbn" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,

    CONSTRAINT "isbn_pkey" PRIMARY KEY ("isbn")
);

-- CreateTable
CREATE TABLE "borrowing" (
    "user_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "borrow_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3),
    "returned" BOOLEAN NOT NULL DEFAULT false,
    "fine" DOUBLE PRECISION,
    "paid" BOOLEAN,
    "payment_id" TEXT,

    CONSTRAINT "borrowing_pkey" PRIMARY KEY ("user_id","book_id")
);

-- CreateTable
CREATE TABLE "reservation" (
    "user_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "reservation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservation_status" "reservationStatusEnum" NOT NULL DEFAULT 'Not_collected',

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("user_id","book_id")
);

-- CreateTable
CREATE TABLE "cart" (
    "user_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "added_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("user_id","book_id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "notificationType" NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finePayment" (
    "id" TEXT NOT NULL,
    "borrowing_user_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reference" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "readHistory" (
    "user_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "review" TEXT,

    CONSTRAINT "readHistory_pkey" PRIMARY KEY ("user_id","book_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- CreateIndex
CREATE INDEX "book_genre_idx" ON "book"("genre");

-- CreateIndex
CREATE INDEX "borrowing_user_id_idx" ON "borrowing"("user_id");

-- CreateIndex
CREATE INDEX "borrowing_book_id_idx" ON "borrowing"("book_id");

-- CreateIndex
CREATE INDEX "reservation_user_id_idx" ON "reservation"("user_id");

-- CreateIndex
CREATE INDEX "reservation_book_id_idx" ON "reservation"("book_id");

-- CreateIndex
CREATE INDEX "cart_user_id_idx" ON "cart"("user_id");

-- CreateIndex
CREATE INDEX "cart_book_id_idx" ON "cart"("book_id");

-- CreateIndex
CREATE INDEX "notification_user_id_idx" ON "notification"("user_id");

-- CreateIndex
CREATE INDEX "notification_is_read_idx" ON "notification"("is_read");

-- CreateIndex
CREATE UNIQUE INDEX "finePayment_reference_key" ON "finePayment"("reference");

-- CreateIndex
CREATE INDEX "finePayment_borrowing_user_id_idx" ON "finePayment"("borrowing_user_id");

-- CreateIndex
CREATE INDEX "readHistory_user_id_idx" ON "readHistory"("user_id");

-- CreateIndex
CREATE INDEX "readHistory_book_id_idx" ON "readHistory"("book_id");

-- AddForeignKey
ALTER TABLE "isbn" ADD CONSTRAINT "isbn_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrowing" ADD CONSTRAINT "borrowing_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "finePayment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrowing" ADD CONSTRAINT "borrowing_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrowing" ADD CONSTRAINT "borrowing_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finePayment" ADD CONSTRAINT "finePayment_borrowing_user_id_fkey" FOREIGN KEY ("borrowing_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "readHistory" ADD CONSTRAINT "readHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "readHistory" ADD CONSTRAINT "readHistory_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
