"use client";

import { useSearch } from "@/hooks/use-search";
import { categories } from "@/lib/data/categories";
import { Cake, Circle, CupSoda, Grid, Leaf, Sandwich, Utensils } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  grid: <Grid size={20} />,
  sandwich: <Sandwich size={20} />,
  circle: <Circle size={20} />,
  utensils: <Utensils size={20} />,
  leaf: <Leaf size={20} />,
  cake: <Cake size={20} />,
  cup: <CupSoda size={20} />
};

export function CategoriesSection() {
  const { selectedCategory, setSelectedCategory } = useSearch();

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold text-foreground'>Categories</h2>
        <a href='#' className='text-accent hover:text-accent/80 text-sm font-medium transition-colors'>
          View More
        </a>
      </div>
      <div className='flex gap-3 overflow-x-auto pb-2'>
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            style={{ animationDelay: `${index * 50}ms` }}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all duration-200 shrink-0 animate-slide-in-up ${
              selectedCategory === category.id
                ? "bg-accent text-accent-foreground"
                : "bg-card text-foreground border border-border hover:border-accent"
            }`}
          >
            <span className='text-lg'>{iconMap[category.icon]}</span>
            <span className='text-sm font-medium'>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
