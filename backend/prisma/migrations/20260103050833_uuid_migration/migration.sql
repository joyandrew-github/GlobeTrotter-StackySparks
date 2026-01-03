/*
  Warnings:

  - The primary key for the `Activity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `City` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Expense` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Trip` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TripStop` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_SavedCities` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_tripStopId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_tripId_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_userId_fkey";

-- DropForeignKey
ALTER TABLE "TripStop" DROP CONSTRAINT "TripStop_cityId_fkey";

-- DropForeignKey
ALTER TABLE "TripStop" DROP CONSTRAINT "TripStop_tripId_fkey";

-- DropForeignKey
ALTER TABLE "_SavedCities" DROP CONSTRAINT "_SavedCities_A_fkey";

-- DropForeignKey
ALTER TABLE "_SavedCities" DROP CONSTRAINT "_SavedCities_B_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tripStopId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Activity_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Activity_id_seq";

-- AlterTable
ALTER TABLE "City" DROP CONSTRAINT "City_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "City_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "City_id_seq";

-- AlterTable
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tripId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Expense_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Expense_id_seq";

-- AlterTable
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Trip_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Trip_id_seq";

-- AlterTable
ALTER TABLE "TripStop" DROP CONSTRAINT "TripStop_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tripId" SET DATA TYPE TEXT,
ALTER COLUMN "cityId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TripStop_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TripStop_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "_SavedCities" DROP CONSTRAINT "_SavedCities_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_SavedCities_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripStop" ADD CONSTRAINT "TripStop_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripStop" ADD CONSTRAINT "TripStop_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_tripStopId_fkey" FOREIGN KEY ("tripStopId") REFERENCES "TripStop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedCities" ADD CONSTRAINT "_SavedCities_A_fkey" FOREIGN KEY ("A") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedCities" ADD CONSTRAINT "_SavedCities_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
