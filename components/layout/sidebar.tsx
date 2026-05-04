'use client';

import { Home, ShoppingCart, Users, Flame, BarChart3, Settings, Bell, Coffee } from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { icon: Coffee, label: 'Dashboard', id: 'dashboard' },
  { icon: ShoppingCart, label: 'Orders', id: 'orders' },
  { icon: Users, label: 'Customers', id: 'customers' },
  { icon: Flame, label: 'Popular', id: 'popular' },
  { icon: BarChart3, label: 'Reports', id: 'reports' },
];

const bottomItems = [
  { icon: Bell, label: 'Notifications', id: 'notifications' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <aside className="hidden md:flex flex-col w-20 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-border">
        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
          <span className="text-accent-foreground font-bold text-lg">S</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col items-center gap-2 py-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`p-3 rounded-xl transition-all duration-200 group relative ${
              activeItem === item.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
            title={item.label}
          >
            <item.icon size={20} />
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-secondary text-foreground text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {item.label}
            </div>
          </button>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="flex flex-col items-center gap-2 py-6 border-t border-border">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 group relative"
            title={item.label}
          >
            <item.icon size={20} />
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-secondary text-foreground text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {item.label}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
