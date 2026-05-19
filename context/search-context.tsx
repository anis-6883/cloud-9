"use client";

import { Product, products } from "@/data/products";
import { createContext, ReactNode, useCallback, useState } from "react";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProducts: Product[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = useCallback(() => {
    let result = products;

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query));
    }

    return result;
  }, [searchQuery, selectedCategory])();

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, filteredProducts, selectedCategory, setSelectedCategory }}>
      {children}
    </SearchContext.Provider>
  );
}
