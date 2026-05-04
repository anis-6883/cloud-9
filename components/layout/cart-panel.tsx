'use client';

import { useCart } from '@/hooks/use-cart';
import { Trash2, Plus, Minus, Copy } from 'lucide-react';
import { useState } from 'react';

export function CartPanel() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="w-full lg:w-80 bg-card/95 backdrop-blur-sm border-l border-t lg:border-t-0 lg:border-l border-border rounded-t-2xl lg:rounded-l-2xl flex flex-col h-[600px] lg:h-full shadow-xl shadow-black/20">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border">
        <h3 className="font-bold text-foreground text-lg">Delivery Address</h3>
        <p className="text-xs text-muted-foreground mt-1">Apt 302A, Sunrise City, Brooklyn, New York</p>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl mb-2">🛒</div>
            <p className="text-muted-foreground text-center text-sm">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex items-start gap-3 bg-secondary rounded-lg p-3">
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm line-clamp-1">{item.product.name}</p>
                  <p className="text-accent font-semibold text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1 bg-border/50 rounded p-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-0.5 hover:bg-border rounded transition-colors"
                  >
                    <Minus size={12} className="text-foreground" />
                  </button>
                  <span className="w-4 text-center text-xs font-medium text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-0.5 hover:bg-border rounded transition-colors"
                  >
                    <Plus size={12} className="text-foreground" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-1.5 hover:bg-destructive/10 rounded text-destructive transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promo Code */}
      {items.length > 0 && (
        <div className="px-4 py-3 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Promotion Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder-muted-foreground outline-none focus:ring-1 focus:ring-accent"
            />
            <button className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <Copy size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      {items.length > 0 && (
        <div className="px-4 py-4 border-t border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-foreground font-medium">${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span className="text-foreground">Total</span>
            <span className="text-accent">${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Footer Buttons */}
      <div className="px-4 py-4 border-t border-border space-y-2">
        {items.length > 0 ? (
          <>
            <button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2.5 rounded-lg transition-colors">
              Confirm Order
            </button>
            <button
              onClick={() => clearCart()}
              className="w-full border border-border hover:bg-secondary text-foreground font-medium py-2.5 rounded-lg transition-colors"
            >
              Clear
            </button>
          </>
        ) : (
          <button className="w-full bg-secondary text-muted-foreground font-medium py-2.5 rounded-lg cursor-not-allowed">
            Add Items
          </button>
        )}
      </div>
    </div>
  );
}
