import { prisma } from "@/backend/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const listing = await prisma.listing.findUnique({
      where: {
        id,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: listing }, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve listing:", error);

    return NextResponse.json(
      { error: "Unable to retrieve listing." },
      { status: 500 },
    );
  }
}
