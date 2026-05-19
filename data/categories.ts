export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'burgers', name: 'Burgers', icon: 'sandwich' },
  { id: 'pizza', name: 'Pizza', icon: 'circle' },
  { id: 'sushi', name: 'Sushi', icon: 'utensils' },
  { id: 'salads', name: 'Salads', icon: 'leaf' },
  { id: 'desserts', name: 'Desserts', icon: 'cake' },
  { id: 'drinks', name: 'Drinks', icon: 'cup' },
];
