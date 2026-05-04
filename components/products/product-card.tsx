'use client';

import { Product } from '@/lib/data/products';
import { Star, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useState } from 'react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItem = items.find(item => item.productId === product.id);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 flex flex-col group animate-fade-in">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-secondary overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover w-full h-full transition-all duration-300 group-hover:scale-110 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadingComplete={() => setIsImageLoaded(true)}
        />
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        
        {/* Stock Badge */}
        <div className="absolute top-3 right-3 bg-accent/10 backdrop-blur-sm border border-accent/30 rounded-lg px-2 py-1">
          <span className="text-xs font-medium text-accent">In Stock</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Name & Rating */}
        <h3 className="font-bold text-foreground mb-1 line-clamp-2">{product.name}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-muted'}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div className="font-bold text-lg text-accent">${product.price}</div>
          
          {cartItem ? (
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <button
                onClick={() => updateQuantity(cartItem.productId, cartItem.quantity - 1)}
                className="p-1 hover:bg-border rounded transition-colors"
              >
                <Minus size={14} className="text-foreground" />
              </button>
              <span className="w-6 text-center text-xs font-medium text-foreground">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(cartItem.productId, cartItem.quantity + 1)}
                className="p-1 hover:bg-border rounded transition-colors"
              >
                <Plus size={14} className="text-foreground" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 flex items-center gap-1"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
