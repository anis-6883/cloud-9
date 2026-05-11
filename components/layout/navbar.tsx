"use client";

import { useAuth } from "@/hooks/use-auth";
import { useSearch } from "@/hooks/use-search";
import { LogOut, Package, Search, User, Utensils } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { openAuthModal } = useAuth();
  const { data: session } = useSession();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  console.log("Session data in Navbar:", session);

  return (
    <nav className='bg-card/95 backdrop-blur-sm border-b border-border'>
      <div className='flex items-center justify-between px-6 py-4'>
        {/* Logo */}
        <div className='flex items-center gap-2'>
          <div className='w-10 h-10 bg-accent rounded-full flex items-center justify-center'>
            <span className='text-accent-foreground font-bold text-lg'>
              <Utensils size={20} />
            </span>
          </div>
          <h1 className='text-xl font-bold text-foreground'>Cloud 9</h1>
        </div>

        {/* Search Bar */}
        <div
          className={`flex-1 mx-8 transition-all duration-200 ${isSearchFocused ? "ring-2 ring-accent" : "ring-1 ring-border"} rounded-lg bg-secondary`}
        >
          <div className='flex items-center px-4 py-2 gap-2'>
            <Search size={18} className='text-muted-foreground' />
            <input
              type='text'
              placeholder='Search items...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className='flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm'
            />
          </div>
        </div>

        {/* Icons */}
        <div className='flex items-center gap-4'>
          <Link
            href='/orders'
            className='px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-semibold transition-colors flex items-center gap-2'
          >
            <Package size={18} />
            Orders
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 cursor-pointer'
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className='px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-semibold transition-colors flex items-center gap-2 cursor-pointer'
            >
              <User size={18} />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
