/*
  Warnings:

  - A unique constraint covering the columns `[name,country]` on the table `City` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "City" ADD COLUMN     "avgDailyCost" INTEGER,
ADD COLUMN     "bestTime" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "highlights" TEXT[],
ADD COLUMN     "image" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "City_name_country_key" ON "City"("name", "country");
