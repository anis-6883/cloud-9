'use client';

import { Order, OrderStatus } from '@/lib/data/orders';
import { X, Phone, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

const statusConfig: Record<OrderStatus, { label: string; bgColor: string; textColor: string }> = {
  pending: { label: 'Pending', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400' },
  processing: { label: 'Processing', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400' },
  cooking: { label: 'Cooking', bgColor: 'bg-purple-500/20', textColor: 'text-purple-400' },
  packaging: { label: 'Packaging', bgColor: 'bg-orange-500/20', textColor: 'text-orange-400' },
  'on-the-way': { label: 'On the Way', bgColor: 'bg-cyan-500/20', textColor: 'text-cyan-400' },
  delivered: { label: 'Delivered', bgColor: 'bg-green-500/20', textColor: 'text-green-400' },
};

interface OrderDetailsSheetProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsSheet({ order, isOpen, onClose }: OrderDetailsSheetProps) {
  const config = statusConfig[order.status];
  const formattedDate = order.date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-card border-l border-border z-50 animate-slide-in-up overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{order.id}</h2>
            <p className="text-sm text-muted-foreground mt-1">{formattedDate}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
          >
            <X size={20} className="text-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${config.bgColor} ${config.textColor}`}>
            {config.label}
          </div>

          {/* Items Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-3 border-b border-border last:border-0">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-accent mt-1">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground font-medium">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="text-foreground font-medium">${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-accent">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Tracking - Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Delivery Tracking</h3>
            <div className="space-y-4">
              {order.timeline.map((step, index) => {
                const stepConfig = statusConfig[step.step];
                const isLast = index === order.timeline.length - 1;
                
                return (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                          step.completed
                            ? `${stepConfig.bgColor} ${stepConfig.textColor}`
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {step.completed ? '✓' : index + 1}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-1 h-8 mt-2 transition-all ${
                            step.completed ? 'bg-accent' : 'bg-border'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-1 flex-1">
                      <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {stepConfig.label}
                      </p>
                      {step.timestamp && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.timestamp.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Delivery Info</h3>
            <div className="flex gap-3">
              <MapPin size={20} className="text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Delivery Address</p>
                <p className="text-foreground font-medium">{order.deliveryAddress}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock size={20} className="text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="text-foreground font-medium">{order.estimatedDeliveryTime}</p>
              </div>
            </div>
          </div>

          {/* Delivery Person Card */}
          <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-4 border border-accent/30">
            <div className="flex gap-4 items-center">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={order.deliveryPerson.avatar}
                  alt={order.deliveryPerson.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{order.deliveryPerson.name}</p>
                <p className="text-sm text-muted-foreground">{order.deliveryPerson.status}</p>
              </div>
              <button className="p-2 bg-accent hover:bg-accent/90 rounded-lg transition-colors flex-shrink-0">
                <Phone size={18} className="text-accent-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
