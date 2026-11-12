"use client";
import React from "react";
import { v1SharedVariables } from "./Assets/sharedVariables";
import useAuthProvider from "./providers/useAuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Home() {
  const router = useRouter();
  const {
    state: { user, isAuthenticated },
  } = useAuthProvider();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);
  return (
    <div>
      <h1 style={{ ...v1SharedVariables.typography.typeScale.display }}>
        Hi {user?.firstName}, Welcome to Urban Nest!
      </h1>
      <p>
        Urban Nest is an app where college students can find and post rooms
        availble to sublet.
      </p>
      <Link href="/create-listing">
        <button className="mt-5 primary-button">Create A New Listing</button>
      </Link>
    </div>
  );
}
