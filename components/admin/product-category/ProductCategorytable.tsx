"use client";

import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { ColumnDef } from "@tanstack/react-table";

type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
};

const data: ProductCategory[] = [
  { id: 1, name: "Electronics", slug: "electronics", createdAt: "2025-01-10" },
  { id: 2, name: "Fashion", slug: "fashion", createdAt: "2025-02-12" }
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

export default function ProductCategoryTable() {
  return (
    <div className='p-4'>
      {/* <PaginationDataTable
        data={data}
        columns={columns}
        pagination={false}
        total={data.length}
        searchable={true}
        searchPlaceholder='Search category...'
        noFoundMessage='No category found!'
      /> */}

      <PaginationDataTable data={data} columns={columns} pagination={false} searchable={true} />
    </div>
  );
}
