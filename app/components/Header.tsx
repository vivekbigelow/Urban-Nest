"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isAuthPage = pathname === "/signup" || pathname === "/login";

  return (
    <header className="flex items-center justify-between border-b-2 border-zinc-950 px-4 py-4">
      <Link href="/">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#315C4A]">
            <span className="text-xl text-[#DDF277]">⌂</span>
          </div>

          <span className="text-2xl font-bold text-[#315C4A]">Urban Nest</span>
        </div>
      </Link>

      {!isAuthPage && (
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/listings">Listings</Link>
        </nav>
      )}
    </header>
  );
}
