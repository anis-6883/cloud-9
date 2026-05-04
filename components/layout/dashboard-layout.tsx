"use client";

import { CategoriesSection } from "@/components/products/categories-section";
import { ProductsGrid } from "@/components/products/products-grid";
import { CartPanel } from "./cart-panel";
import { Navbar } from "./navbar";

export function DashboardLayout() {
  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <div className='flex-1 flex flex-col lg:flex-row'>
        <div className='flex-1 flex flex-col overflow-hidden'>
          {/* Navbar */}
          <Navbar />

          {/* Main Content Area */}
          <div className='flex-1 overflow-y-auto'>
            <div className='max-w-7xl mx-auto px-6 py-6'>
              <CategoriesSection />
              <ProductsGrid />
            </div>
          </div>
        </div>

        {/* Cart Panel */}
        <CartPanel />
      </div>
    </div>
  );
}
