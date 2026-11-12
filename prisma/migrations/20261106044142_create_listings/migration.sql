-- CreateTable
CREATE TABLE "listings" (
    "listingsId" UUID NOT NULL DEFAULT gen_random_uuid(),
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

    CONSTRAINT "listings_pkey" PRIMARY KEY ("listingsId")
);

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
