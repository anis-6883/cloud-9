"use client";

import { Order, OrderStatus } from "@/data/orders";
import { ChevronRight } from "lucide-react";

const statusConfig: Record<OrderStatus, { label: string; bgColor: string; textColor: string }> = {
  pending: { label: "Pending", bgColor: "bg-yellow-500/20", textColor: "text-yellow-400" },
  processing: { label: "Processing", bgColor: "bg-blue-500/20", textColor: "text-blue-400" },
  cooking: { label: "Cooking", bgColor: "bg-purple-500/20", textColor: "text-purple-400" },
  packaging: { label: "Packaging", bgColor: "bg-orange-500/20", textColor: "text-orange-400" },
  "on-the-way": { label: "On the Way", bgColor: "bg-cyan-500/20", textColor: "text-cyan-400" },
  delivered: { label: "Delivered", bgColor: "bg-green-500/20", textColor: "text-green-400" }
};

interface OrderCardProps {
  order: Order;
  onViewDetails: () => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const config = statusConfig[order.status];
  const formattedDate = order.date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className='bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 flex flex-col animate-fade-in'>
      <div className='p-4 flex-1'>
        {/* Header */}
        <div className='flex items-start justify-between mb-4'>
          <div>
            <h3 className='font-semibold text-foreground'>{order.id}</h3>
            <p className='text-sm text-muted-foreground'>{formattedDate}</p>
          </div>
          <div className={`px-3 py-1 rounded-lg text-sm font-medium ${config.bgColor} ${config.textColor}`}>{config.label}</div>
        </div>

        {/* Details */}
        <div className='space-y-3 mb-4'>
          <div className='flex justify-between items-center'>
            <span className='text-muted-foreground text-sm'>Items</span>
            <span className='font-semibold'>{order.itemCount}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-muted-foreground text-sm'>Total</span>
            <span className='text-lg font-bold text-accent'>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <button
        onClick={onViewDetails}
        className='w-full px-4 py-3 bg-accent/10 hover:bg-accent/20 text-accent font-semibold transition-colors flex items-center justify-center gap-2 border-t border-border'
      >
        View Details
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
