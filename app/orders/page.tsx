"use client";

import { Navbar } from "@/components/layout/navbar";
import { OrderList } from "@/components/orders/order-list";

export default function OrdersPage() {
  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <main className='max-w-6xl mx-auto px-4 md:px-6 py-8'>
        <OrderList />
      </main>
    </div>
  );
}
