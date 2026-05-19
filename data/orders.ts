export type OrderStatus = "pending" | "processing" | "cooking" | "packaging" | "on-the-way" | "delivered";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: Date;
  totalAmount: number;
  itemCount: number;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  deliveryAddress: string;
  estimatedDeliveryTime: string;
  deliveryPerson: {
    name: string;
    avatar: string;
    phone: string;
    status: string;
  };
  timeline: {
    step: OrderStatus;
    completed: boolean;
    timestamp?: Date;
  }[];
}

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    date: new Date(2026, 4, 2, 14, 30),
    totalAmount: 45.99,
    itemCount: 3,
    status: "delivered",
    items: [
      {
        id: "1",
        name: "Hamburger",
        quantity: 2,
        price: 12.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop"
      },
      {
        id: "2",
        name: "Coca Cola",
        quantity: 1,
        price: 3.99,
        image: "https://images.unsplash.com/photo-1554866585-acbb2f7cb371?w=400&h=400&fit=crop"
      }
    ],
    subtotal: 29.99,
    deliveryFee: 3.99,
    deliveryAddress: "123 Main St, New York, NY 10001",
    estimatedDeliveryTime: "30-45 minutes",
    deliveryPerson: {
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      phone: "+1 (555) 123-4567",
      status: "Delivered"
    },
    timeline: [
      { step: "pending", completed: true, timestamp: new Date(2026, 4, 2, 14, 30) },
      { step: "processing", completed: true, timestamp: new Date(2026, 4, 2, 14, 35) },
      { step: "cooking", completed: true, timestamp: new Date(2026, 4, 2, 14, 45) },
      { step: "packaging", completed: true, timestamp: new Date(2026, 4, 2, 15, 0) },
      { step: "on-the-way", completed: true, timestamp: new Date(2026, 4, 2, 15, 5) },
      { step: "delivered", completed: true, timestamp: new Date(2026, 4, 2, 15, 20) }
    ]
  },
  {
    id: "ORD-002",
    date: new Date(2026, 5, 3, 18, 15),
    totalAmount: 32.48,
    itemCount: 2,
    status: "on-the-way",
    items: [
      {
        id: "3",
        name: "Pizza Margherita",
        quantity: 1,
        price: 16.99,
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop"
      },
      {
        id: "4",
        name: "Caesar Salad",
        quantity: 1,
        price: 9.99,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"
      }
    ],
    subtotal: 26.98,
    deliveryFee: 3.99,
    deliveryAddress: "456 Oak Ave, Los Angeles, CA 90001",
    estimatedDeliveryTime: "20-25 minutes",
    deliveryPerson: {
      name: "Maria Garcia",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      phone: "+1 (555) 987-6543",
      status: "On the way"
    },
    timeline: [
      { step: "pending", completed: true, timestamp: new Date(2026, 5, 3, 18, 15) },
      { step: "processing", completed: true, timestamp: new Date(2026, 5, 3, 18, 20) },
      { step: "cooking", completed: true, timestamp: new Date(2026, 5, 3, 18, 30) },
      { step: "packaging", completed: true, timestamp: new Date(2026, 5, 3, 18, 45) },
      { step: "on-the-way", completed: true, timestamp: new Date(2026, 5, 3, 18, 50) },
      { step: "delivered", completed: false }
    ]
  },
  {
    id: "ORD-003",
    date: new Date(2026, 5, 4, 12, 0),
    totalAmount: 28.97,
    itemCount: 2,
    status: "cooking",
    items: [
      {
        id: "5",
        name: "Sushi Roll",
        quantity: 1,
        price: 14.99,
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop"
      },
      {
        id: "6",
        name: "Miso Soup",
        quantity: 1,
        price: 6.99,
        image: "https://images.unsplash.com/photo-1597103442097-8055c3fbb565?w=400&h=400&fit=crop"
      }
    ],
    subtotal: 21.98,
    deliveryFee: 3.99,
    deliveryAddress: "789 Pine Rd, Chicago, IL 60601",
    estimatedDeliveryTime: "35-40 minutes",
    deliveryPerson: {
      name: "David Lee",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      phone: "+1 (555) 246-8135",
      status: "Cooking"
    },
    timeline: [
      { step: "pending", completed: true, timestamp: new Date(2026, 5, 4, 12, 0) },
      { step: "processing", completed: true, timestamp: new Date(2026, 5, 4, 12, 5) },
      { step: "cooking", completed: true },
      { step: "packaging", completed: false },
      { step: "on-the-way", completed: false },
      { step: "delivered", completed: false }
    ]
  },
  {
    id: "ORD-004",
    date: new Date(2026, 5, 4, 19, 45),
    totalAmount: 52.97,
    itemCount: 4,
    status: "pending",
    items: [
      {
        id: "7",
        name: "Burger Combo",
        quantity: 2,
        price: 24.98,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop"
      },
      {
        id: "8",
        name: "Fries",
        quantity: 2,
        price: 7.98,
        image: "https://images.unsplash.com/photo-1580070142136-e280220556ea?w=400&h=400&fit=crop"
      }
    ],
    subtotal: 32.96,
    deliveryFee: 3.99,
    deliveryAddress: "321 Elm St, Houston, TX 77001",
    estimatedDeliveryTime: "40-50 minutes",
    deliveryPerson: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1507009307501-a500a3f0b1d8?w=100&h=100&fit=crop",
      phone: "+1 (555) 135-7924",
      status: "Pending"
    },
    timeline: [
      { step: "pending", completed: true },
      { step: "processing", completed: false },
      { step: "cooking", completed: false },
      { step: "packaging", completed: false },
      { step: "on-the-way", completed: false },
      { step: "delivered", completed: false }
    ]
  }
];
