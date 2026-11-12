/*
  Warnings:

  - You are about to drop the `listings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "listings" DROP CONSTRAINT "listings_userId_fkey";

-- DropTable
DROP TABLE "listings";

-- CreateTable
CREATE TABLE "listing" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monthlyRentPrice" DECIMAL(10,2) NOT NULL,
    "leaseTitle" TEXT NOT NULL,
    "leaseDescription" TEXT NOT NULL,
    "subleaseDurationMonths" INTEGER,
    "isIndefinite" BOOLEAN NOT NULL DEFAULT false,
    "unitType" TEXT NOT NULL,
    "livingSpaceType" TEXT NOT NULL,
    "additionalRoomCount" INTEGER NOT NULL,
    "subleaseRoomCount" INTEGER NOT NULL,
    "tenantCount" INTEGER NOT NULL,
    "bathRoomCount" INTEGER NOT NULL,
    "unitStatus" TEXT NOT NULL DEFAULT 'Available',
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "freeWifi" BOOLEAN DEFAULT false,
    "freeParking" BOOLEAN DEFAULT false,
    "petFriendly" BOOLEAN DEFAULT false,
    "washerDryer" BOOLEAN DEFAULT false,
    "cookingSpace" BOOLEAN DEFAULT false,
    "imageRefs" TEXT[],

    CONSTRAINT "listing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
