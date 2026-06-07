"use client";

import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type ProductCategory = {
  _id: string;
  name: string;
  slug: string;
  status: boolean;
  createdAt: string;
  image?: {
    publicId: string;
    secureUrl: string;
  };
};

const columns: ColumnDef<ProductCategory>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1
  },
  {
    header: "Image",
    cell: ({ row }) => (
      <Avatar className='h-10 w-10'>
        <AvatarImage src={row.original.image?.secureUrl} alt={row.original.name} className='object-cover' />
        <AvatarFallback>{row.original.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
    )
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
    header: "Created Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  }
];

interface ProductCategoryTableProps {
  data: ProductCategory[];
  total: number;
}

function ProductCategoryTableInner({ data, total }: ProductCategoryTableProps) {
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
        total={total}
        searchable={true}
        searchPlaceholder='Search category...'
        noFoundMessage='No category found!'
      />
    </div>
  );
}

export default function ProductCategoryTable({ data, total }: ProductCategoryTableProps) {
  return (
    <Suspense fallback={<div className='p-4'>Loading...</div>}>
      <ProductCategoryTableInner data={data} total={total} />
    </Suspense>
  );
}
