/*
  Warnings:

  - You are about to drop the column `destination` on the `Batch` table. All the data in the column will be lost.
  - Added the required column `destinationAdres` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationIp` to the `Batch` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "destinationIp" TEXT NOT NULL,
    "destinationAdres" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Batch" ("createdAt", "id") SELECT "createdAt", "id" FROM "Batch";
DROP TABLE "Batch";
ALTER TABLE "new_Batch" RENAME TO "Batch";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
