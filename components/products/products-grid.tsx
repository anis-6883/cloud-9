'use client';

import { useSearch } from '@/hooks/use-search';
import { ProductCard } from './product-card';

export function ProductsGrid() {
  const { filteredProducts } = useSearch();

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-bold text-foreground mb-2">No items found</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Try searching for something different or browse our other categories.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Popular Dishes</h2>
        <a href="#" className="text-accent hover:text-accent/80 text-sm font-medium transition-colors">View More</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
