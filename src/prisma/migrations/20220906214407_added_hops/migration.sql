/*
  Warnings:

  - Added the required column `hops` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hop` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "destinationIp" TEXT NOT NULL,
    "destinationAdres" TEXT NOT NULL,
    "hops" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Batch" ("createdAt", "destinationAdres", "destinationIp", "id") SELECT "createdAt", "destinationAdres", "destinationIp", "id" FROM "Batch";
DROP TABLE "Batch";
ALTER TABLE "new_Batch" RENAME TO "Batch";
CREATE TABLE "new_Result" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hop" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "batchId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Result_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("batchId", "createdAt", "date", "id", "ip", "updatedAt") SELECT "batchId", "createdAt", "date", "id", "ip", "updatedAt" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
