"use client";

import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type ProductCategory = {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
};

const data: ProductCategory[] = [
  { _id: "1", name: "Electronics", slug: "electronics", createdAt: "2025-01-10" },
  { _id: "2", name: "Fashion", slug: "fashion", createdAt: "2025-02-12" },
  { _id: "3", name: "Beverages", slug: "beverages", createdAt: "2025-02-15" },
  { _id: "4", name: "Snacks", slug: "snacks", createdAt: "2025-02-20" },
  { _id: "5", name: "Desserts", slug: "desserts", createdAt: "2025-03-01" },
  { _id: "6", name: "Fast Food", slug: "fast-food", createdAt: "2025-03-05" },
  { _id: "7", name: "Seafood", slug: "seafood", createdAt: "2025-03-10" },
  { _id: "8", name: "Vegetarian", slug: "vegetarian", createdAt: "2025-03-12" },
  { _id: "9", name: "Grills & BBQ", slug: "grills-bbq", createdAt: "2025-03-15" },
  { _id: "10", name: "Pasta & Noodles", slug: "pasta-noodles", createdAt: "2025-03-18" },
  { _id: "11", name: "Soups & Stews", slug: "soups-stews", createdAt: "2025-03-20" },
  { _id: "12", name: "Salads", slug: "salads", createdAt: "2025-03-22" },
  { _id: "13", name: "Breakfast", slug: "breakfast", createdAt: "2025-03-25" },
  { _id: "14", name: "Burgers", slug: "burgers", createdAt: "2025-04-01" },
  { _id: "15", name: "Pizza", slug: "pizza", createdAt: "2025-04-03" },
  { _id: "16", name: "Sushi", slug: "sushi", createdAt: "2025-04-05" },
  { _id: "17", name: "Tacos & Wraps", slug: "tacos-wraps", createdAt: "2025-04-07" },
  { _id: "18", name: "Ice Cream", slug: "ice-cream", createdAt: "2025-04-10" },
  { _id: "19", name: "Juices", slug: "juices", createdAt: "2025-04-12" },
  { _id: "20", name: "Coffee & Tea", slug: "coffee-tea", createdAt: "2025-04-15" },
  { _id: "21", name: "Bakery", slug: "bakery", createdAt: "2025-04-17" },
  { _id: "22", name: "Dim Sum", slug: "dim-sum", createdAt: "2025-04-19" },
  { _id: "23", name: "Curries", slug: "curries", createdAt: "2025-04-21" },
  { _id: "24", name: "Sandwiches", slug: "sandwiches", createdAt: "2025-04-23" },
  { _id: "25", name: "Rice Dishes", slug: "rice-dishes", createdAt: "2025-04-25" }
];

const columns: ColumnDef<ProductCategory>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: "name",
    header: "Category Name"
  },
  {
    accessorKey: "slug",
    header: "Slug"
  },
  {
    accessorKey: "createdAt",
    header: "Created Date"
  }
];

function ProductCategoryTableInner() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const paginatedData = data.slice((page - 1) * limit, page * limit);

  return (
    <div className='p-4'>
      <PaginationDataTable
        data={paginatedData}
        columns={columns}
        pagination={true}
        total={data.length}
        searchable={true}
        searchPlaceholder='Search category...'
        noFoundMessage='No category found!'
      />
    </div>
  );
}

export default function ProductCategoryTable() {
  return (
    <Suspense fallback={<div className='p-4'>Loading...</div>}>
      <ProductCategoryTableInner />
    </Suspense>
  );
}
