# Cloud-9 E-commerce Platform

Cloud-9 is a modern, high-performance single-vendor e-commerce platform built with the latest web technologies. It provides a seamless shopping experience for customers and a robust management system for the store owner.

## 🚀 Features

### Customer Experience
- **Product Discovery**: Browse through a curated catalog of products with high-quality imagery.
- **Advanced Search**: Quickly find products using the real-time search functionality.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **Shopping Cart**: Dynamic cart management to add, update, and remove items before checkout.
- **Interactive Carousels**: Engaging product displays using Embla Carousel.
- **Order Tracking**: Customers can view their order history and current status.
- **Analytics Dashboard**: (Internal) Visualized sales and performance data using Recharts.
- **Secure Authentication**: User accounts powered by NextAuth.js for a secure and smooth login experience.
- **Dark Mode**: Built-in theme support for light and dark modes.

### Store Operations (Single Vendor)
- **Product Management**: Centralized control over the product inventory.
- **Order Fulfillment**: Streamlined process for viewing and managing customer orders.
- **Unified Branding**: A consistent and premium design tailored for a single-brand experience.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)

## 🏁 Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- pnpm (or npm/yarn)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cloud-9
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your configuration (Database URLs, Auth Secrets, etc.).

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `/app`: Next.js App Router pages and API routes.
- `/components`: Reusable UI components (Layout, Products, Orders, Auth).
- `/hooks`: Custom React hooks for cart, search, and authentication.
- `/lib`: Utility functions and shared configurations.
- `/public`: Static assets like images and icons.
- `/styles`: Global CSS and theme configurations.

## 📄 License

This project is licensed under the MIT License.
