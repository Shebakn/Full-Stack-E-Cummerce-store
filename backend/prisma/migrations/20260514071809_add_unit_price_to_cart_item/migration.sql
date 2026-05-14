/*
  Warnings:

  - Added the required column `unitPrice` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "unitPrice" DECIMAL(10,2) NOT NULL;
