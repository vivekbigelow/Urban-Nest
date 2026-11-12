"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Listing } from "@/app/types/listing";
import useAuthProvider from "@/app/providers/useAuthProvider";
import React from "react";

const showIsIncluded = <p className="text-(--dark-section)">Yes · Included</p>;

const showIsNotIncluded = <p className="text-[#66717E]">No · Not Included</p>;

export default function ListingDetails() {
  const { id } = useParams();
  console.log("ID", id);
  const [listing, setListing] = useState<Listing | null>(null);

  const router = useRouter();
  const {
    state: { isAuthenticated },
  } = useAuthProvider();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function fetchListing() {
      const response = await fetch(`/api/listings/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch listing.");
      }

      const { data } = await response.json();
      setListing(data);
    }

    fetchListing();
  }, [id]);

  if (!listing) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className="bg-background flex-row w-280 items-center justify-center mx-auto ">
        <div className="mx-auto w-full max-w-280 px-4 pt-1">
          <h1>{listing.leaseTitle}</h1>
          <p className="text-[#66716E]"> {listing.leaseDescription}</p>
        </div>

        <img
          src={listing.imageRefs[0]}
          alt={`${listing.leaseTitle}`}
          className="mx-auto mt-6 mb-3 h-90 w-full max-w-190 rounded-2xl object-cover"
        ></img>

        <div className="mb-10  flex items-center justify-between">
          <button className="inline-flex items-center gap-2 justify-center rounded-full bg-white px-4 py-2 font-semibold text-(--dark-section) w-26.75">
            <span>←</span>
            Previous
          </button>

          <button className="inline-flex items-center gap-2 justify-center rounded-full bg-white px-4 py-2 font-semibold text-(--dark-section) w-26.75">
            Next
            <span>→</span>
          </button>
        </div>

        <section className="card-container my-3">
          <div>
            <h2 className="text-4xl font-bold text-(--dark-section)">
              Listing Details
            </h2>
            <p className="mt-1 text-[#66716E]">
              The essentials about this sublease
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-1">
              <p className="text-(--dark-section)">Lease Title</p>
              <p className="text-[17px]">{listing.leaseTitle}</p>
            </div>

            <div className="space-y-1">
              <p className="text-(--dark-section)">Lease Description</p>
              <p className="text-[17px]">{listing.leaseDescription}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-(--dark-section)">Monthly Rent</p>
                <p className="text-[17px]">
                  ${listing.monthlyRentPrice} USD / Month
                </p>
                <p className="pt-1 text-[#66716E]">
                  Rent for the space being subleased, per month.
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-(--dark-section)">Sublease Duration</p>
                <p className="text-[17px]">
                  {listing.subleaseDurationMonths} Months
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="card-container my-3">
          <h2 className="text-4xl font-bold text-(--dark-section)">
            Space Details
          </h2>
          <p className="mt-1 text-[#66716E]">
            The space and who it’s shared with.
          </p>

          <div className="mt-6 space-y-6">
            <div className="space-y-1">
              <p className="text-(--dark-section)">Unit Type</p>
              <p className="text-[17px]">{listing.unitType}</p>
            </div>

            <div className="space-y-1">
              <p className="text-(--dark-section)">Living Space Type</p>
              <p className="text-[17px]">{listing.livingSpaceType}</p>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-(--dark-section)">Rooms Being Subleased</p>
                  <p className="text-[#66716E]">
                    Rooms offered in this listing.
                  </p>
                </div>
                <div className="space-y-1 text-right font-semibold text-[17px]">
                  <p>{listing.subleaseRoomCount}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-(--dark-section)">Additional Rooms</p>
                  <p className="text-[#66716E]">
                    Other rooms in the unit, beyond the room being offered.
                  </p>
                </div>
                <div className="space-y-1 text-right font-semibold text-[17px]">
                  <p>{listing.additionalRoomCount}</p>
                </div>

                <div>
                  <p className="text-(--dark-section)">Current Other Tenants</p>
                  <p className="text-[#66716E]">
                    Other people currently living in the entire unit, not
                    including the lister.
                  </p>
                </div>
                <div className="space-y-1 text-right font-semibold text-[17px]">
                  <p>{listing.tenantCount}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="card-container my-3">
          <h2 className="text-4xl font-bold text-(--dark-section)">
            Property Address
          </h2>
          <p className="mt-1 text-[#66716E]">Where the space is located.</p>

          <div className="mt-6 space-y-6">
            <div className="space-y-1">
              <p className="text-(--dark-section)">Street Address</p>
              <p className="text-[17px]">{listing.street}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-(--dark-section)">City</p>
                <p className="text-[17px]">{listing.city}</p>
              </div>
              <div className="space-y-1">
                <p className="text-(--dark-section)">State</p>
                <p className="text-[17px]">{listing.state}</p>
              </div>
              <div className="space-y-1">
                <p className="text-(--dark-section)">ZIP Code</p>
                <p className="text-[17px]">{listing.zipCode}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="card-container my-3">
          <h2 className="text-4xl font-bold text-(--dark-section)">
            Amenities
          </h2>
          <p className="mt-1 text-[#66716E]">
            What’s included — and what isn’t.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-(--dark-section)">Free Wi-Fi</p>
              {listing.freeWifi ? showIsIncluded : showIsNotIncluded}
            </div>
            <div className="space-y-1">
              <p className="text-(--dark-section)">Free Parking</p>
              {listing.freeParking ? showIsIncluded : showIsNotIncluded}
            </div>
            <div className="space-y-1">
              <p className="text-(--dark-section)">Pet Friendly</p>
              {listing.petFriendly ? showIsIncluded : showIsNotIncluded}
            </div>
            <div className="space-y-1">
              <p className="text-(--dark-section)">Washer/Dryer</p>
              {listing.washerDryer ? showIsIncluded : showIsNotIncluded}
            </div>
            <div className="space-y-1">
              <p className="text-(--dark-section)">Cooking Space</p>
              {listing.cookingSpace ? showIsIncluded : showIsNotIncluded}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
