/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BookSeries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BookType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Lending` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "bookTypeId" TEXT NOT NULL,
    "bookSeriesId" TEXT,
    "color" BOOLEAN NOT NULL,
    CONSTRAINT "Book_bookTypeId_fkey" FOREIGN KEY ("bookTypeId") REFERENCES "BookType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_bookSeriesId_fkey" FOREIGN KEY ("bookSeriesId") REFERENCES "BookSeries" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("author", "bookSeriesId", "bookTypeId", "color", "id", "isbn", "title") SELECT "author", "bookSeriesId", "bookTypeId", "color", "id", "isbn", "title" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE TABLE "new_BookSeries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_BookSeries" ("id", "name") SELECT "id", "name" FROM "BookSeries";
DROP TABLE "BookSeries";
ALTER TABLE "new_BookSeries" RENAME TO "BookSeries";
CREATE TABLE "new_BookType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_BookType" ("id", "name") SELECT "id", "name" FROM "BookType";
DROP TABLE "BookType";
ALTER TABLE "new_BookType" RENAME TO "BookType";
CREATE TABLE "new_Lending" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" TEXT NOT NULL,
    CONSTRAINT "Lending_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lending" ("bookId", "date", "id", "name", "returnDate") SELECT "bookId", "date", "id", "name", "returnDate" FROM "Lending";
DROP TABLE "Lending";
ALTER TABLE "new_Lending" RENAME TO "Lending";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
