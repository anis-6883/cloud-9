"use client";

import { mockOrders } from "@/data/orders";
import { useState } from "react";
import { OrderCard } from "./order-card";
import { OrderDetailsSheet } from "./order-details-sheet";

export function OrderList() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const selectedOrder = mockOrders.find(order => order.id === selectedOrderId);

  return (
    <>
      <div className='space-y-4'>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-foreground mb-2'>My Orders</h2>
          <p className='text-muted-foreground'>View and track all your orders</p>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {mockOrders.map(order => (
            <OrderCard key={order.id} order={order} onViewDetails={() => setSelectedOrderId(order.id)} />
          ))}
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsSheet order={selectedOrder} isOpen={selectedOrderId !== null} onClose={() => setSelectedOrderId(null)} />
      )}
    </>
  );
}
