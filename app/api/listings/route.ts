import { prisma } from "@/backend/lib/prisma";
import { z } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { sessionMap } from "@/backend/lib/auth";
import { uploadListingPhotos } from "@/backend/lib/supabaseStorage";

const usStates = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
] as const;

const listingInputSchema = z
  .object({
    monthlyRentPrice: z.number().min(0),

    leaseTitle: z.string().trim().min(1),

    leaseDescription: z.string().trim().min(1),

    subleaseDurationMonths: z.number().int().positive().nullable(),
    isIndefinite: z.boolean(),

    unitType: z.enum([
      "Apartment",
      "House",
      "Townhouse",
      "Condo",
      "Duplex",
      "Triplex",
      "Other",
    ]),

    livingSpaceType: z.enum(["PrivateSpace", "SharedSpace"]),

    additionalRoomCount: z.number().int().min(0),

    subleaseRoomCount: z.number().int().min(1),

    tenantCount: z.number().int().min(0),
    bathRoomCount: z.number().int().min(1),

    street: z.string().trim().min(1),
    city: z.string().trim().min(1),
    state: z.enum(usStates),
    zipCode: z.string().regex(/^[0-9]{5}$/),

    freeWifi: z.boolean().default(false),
    freeParking: z.boolean().default(false),
    petFriendly: z.boolean().default(false),
    washerDryer: z.boolean().default(false),
    cookingSpace: z.boolean().default(false),
  })
  .refine(
    ({ isIndefinite, subleaseDurationMonths }) =>
      isIndefinite
        ? subleaseDurationMonths === null
        : subleaseDurationMonths !== null,
    {
      message:
        "Provide a positive number of months or mark the duration indefinite",
    },
  );

const createListingSchema = listingInputSchema.extend({
  imageRefs: z.array(z.string().trim().min(1)).min(2).max(10),
});

export async function POST(request: NextRequest) {
  const token = request.cookies.get("sessionId")?.value;
  const userId = token ? sessionMap.get(token) : undefined;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const listingValue = formData.get("listing");

    if (typeof listingValue !== "string") {
      return NextResponse.json(
        { error: "Missing listing data." },
        { status: 400 },
      );
    }

    const { address, amenities, ...listingData } = JSON.parse(listingValue);
    const flattenedListingInput = { ...listingData, ...address, ...amenities };

    const result = listingInputSchema.safeParse(flattenedListingInput);

    if (!result.success) {
      return NextResponse.json(
        { errors: z.flattenError(result.error) },
        { status: 400 },
      );
    }

    const photos = formData
      .getAll("photos")
      .filter((value): value is File => value instanceof File);

    if (photos.length < 2 || photos.length > 10) {
      return NextResponse.json(
        { error: "You must provide between 2 and 10 photos." },
        { status: 400 },
      );
    }

    const listing = await prisma.listing.create({
      data: { ...result.data, userId, imageRefs: [] },
    });

    let imageRefs: string[];
    try {
      imageRefs = await uploadListingPhotos(photos, listing.id);
    } catch (error) {
      console.error("Photo upload failed:", error);

      // Delete the listing because its images failed to upload
      await prisma.listing.delete({
        where: {
          id: listing.id,
        },
      });

      return NextResponse.json(
        { error: "Unable to upload listing photos." },
        { status: 500 },
      );
    }

    const finalListing = createListingSchema.safeParse({
      ...flattenedListingInput,
      imageRefs,
    });

    if (!finalListing.success) {
      return NextResponse.json(
        { errors: z.flattenError(finalListing.error) },
        { status: 400 },
      );
    }

    const updatedListing = await prisma.listing.update({
      where: {
        id: listing.id,
      },
      data: {
        imageRefs,
      },
    });

    return NextResponse.json(
      { result: "Success", data: updatedListing },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create listing:", error);
    return NextResponse.json(
      { error: "Unable to create listing." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        created_at: true,
        monthlyRentPrice: true,
        leaseTitle: true,
        leaseDescription: true,
        subleaseDurationMonths: true,
        isIndefinite: true,
        unitType: true,
        livingSpaceType: true,
        additionalRoomCount: true,
        subleaseRoomCount: true,
        tenantCount: true,
        bathRoomCount: true,
        unitStatus: true,
        street: true,
        city: true,
        state: true,
        zipCode: true,
        freeWifi: true,
        freeParking: true,
        petFriendly: true,
        washerDryer: true,
        cookingSpace: true,
        imageRefs: true,
      },
    });

    return NextResponse.json({ data: listings }, { status: 200 });
  } catch (error) {
    console.error("Failed to retireve listings:", error);

    return NextResponse.json(
      { error: "Unable to retrieve listings." },
      { status: 500 },
    );
  }
}
