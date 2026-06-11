"use client";

import { deleteProduct } from "@/actions/admin/product-management/product-actions";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import Toast from "@/components/shared/Toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

interface ProductTableProps {
  data: Product[];
  total: number;
}

function ProductTableInner({ data, total }: ProductTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const t = Toast.loading({ title: "Status", description: "Deleting product..." });
    try {
      const res = (await deleteProduct(deleteId)) as any;
      Toast.remove(t);
      if (!res?.status) throw new Error(res?.message || "Failed to delete product!");
      Toast.success({ title: "Success", description: "Product deleted successfully!" });
      setDeleteId(null);
      router.refresh();
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to delete product!" });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      header: "SL",
      cell: ({ row }) => (page - 1) * limit + row.index + 1
    },
    {
      header: "Image",
      cell: ({ row }) => (
        <Avatar className='h-10 w-10 rounded-md'>
          <AvatarImage src={row.original.image?.secureUrl} alt={row.original.name} className='object-cover' />
          <AvatarFallback className='rounded-md'>{row.original.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )
    },
    {
      accessorKey: "name",
      header: "Product Name"
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className='space-y-0.5'>
          <p className='font-medium'>৳{row.original.price}</p>
          {row.original.hasDiscount && (
            <p className='text-xs text-green-600'>
              ৳{row.original.discountPrice} ({row.original.discountPctAmount}% off)
            </p>
          )}
        </div>
      )
    },
    {
      accessorKey: "shortDesc",
      header: "Description",
      cell: ({ row }) => <span className='line-clamp-2 max-w-xs text-sm text-muted-foreground'>{row.original.shortDesc}</span>
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status ? "default" : "secondary"}>{row.original.status ? "Active" : "Inactive"}</Badge>
      )
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Link href={`/admin/product-management/brand/edit/${row.original._id}`}>
            <Button variant='outline' size='icon'>
              <Pencil className='h-4 w-4' />
            </Button>
          </Link>
          <Button variant='destructive' size='icon' onClick={() => setDeleteId(row.original._id)}>
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ];

  const paginatedData = data.slice((page - 1) * limit, page * limit);

  return (
    <>
      <div className='p-4'>
        <PaginationDataTable
          data={paginatedData}
          columns={columns}
          pagination={true}
          total={total}
          searchable={true}
          searchPlaceholder='Search product...'
          noFoundMessage='No product found!'
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>Are you sure you want to delete this product? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2'>
            <Button variant='outline' onClick={() => setDeleteId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Yes, Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ProductTable({ data, total }: ProductTableProps) {
  return (
    <Suspense fallback={<div className='p-4'>Loading...</div>}>
      <ProductTableInner data={data} total={total} />
    </Suspense>
  );
}
