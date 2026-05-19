export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  description?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Cheeseburger",
    category: "burgers",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop",
    rating: 4.5,
    reviews: 120,
    description: "Juicy beef patty with melted cheese"
  },
  {
    id: "2",
    name: "Classic Pizza",
    category: "pizza",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 250,
    description: "Traditional pizza with fresh basil"
  },
  {
    id: "3",
    name: "Spicy Sushi",
    category: "sushi",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 180,
    description: "Fresh sushi with spicy mayo"
  },
  {
    id: "4",
    name: "Veggie Burger",
    category: "burgers",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop",
    rating: 4.3,
    reviews: 95,
    description: "Plant-based burger patty"
  },
  {
    id: "5",
    name: "Pepperoni Pizza",
    category: "pizza",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 320,
    description: "Loaded with pepperoni"
  },
  {
    id: "6",
    name: "Shrimp Sushi",
    category: "sushi",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 210,
    description: "Premium shrimp sushi rolls"
  },
  {
    id: "7",
    name: "Garden Salad",
    category: "salads",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
    rating: 4.2,
    reviews: 80,
    description: "Fresh mixed greens with dressing"
  },
  {
    id: "8",
    name: "Caesar Salad",
    category: "salads",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
    rating: 4.4,
    reviews: 110,
    description: "Classic Caesar salad with croutons"
  },
  {
    id: "9",
    name: "Chocolate Cake",
    category: "desserts",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 290,
    description: "Rich and fudgy chocolate cake"
  },
  {
    id: "10",
    name: "Vanilla Ice Cream",
    category: "desserts",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 150,
    description: "Creamy vanilla ice cream"
  },
  {
    id: "11",
    name: "Orange Juice",
    category: "drinks",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop",
    rating: 4.5,
    reviews: 70,
    description: "Fresh squeezed orange juice"
  },
  {
    id: "12",
    name: "Iced Coffee",
    category: "drinks",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 200,
    description: "Cold brew iced coffee"
  }
];
