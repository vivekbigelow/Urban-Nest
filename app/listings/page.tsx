"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Listing } from "../types/listing";
import { useRouter } from "next/navigation";
import useAuthProvider from "../providers/useAuthProvider";
import React from "react";

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

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
    async function fetchListings() {
      try {
        const response = await fetch("api/listings");

        if (!response.ok) {
          throw new Error("Failed to fetch listings.");
        }
        const data = await response.json();
        setListings(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  if (loading) {
    return <p>Loading listings...</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3  ">
      {listings.map((listing) => (
        <div key={listing.id} className="card-container">
          <Link href={`/listings/${listing.id}`}>
            <div>
              <h2>{listing.leaseTitle}</h2>
              <p>{listing.leaseDescription}</p>
              <p>${listing.monthlyRentPrice}/month</p>
              <p>
                {listing.city}, {listing.state}
              </p>

              {listing.imageRefs?.[0] && (
                <img src={listing.imageRefs[0]} alt={listing.leaseTitle} />
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
