"use client";

import { deleteProductCategory } from "@/actions/admin/product-management/product-category-actions";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import Toast from "@/components/shared/Toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

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

interface ProductCategoryTableProps {
  data: ProductCategory[];
  total: number;
}

function ProductCategoryTableInner({ data, total }: ProductCategoryTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const t = Toast.loading({ title: "Status", description: "Deleting category..." });
    try {
      const res = (await deleteProductCategory(deleteId)) as any;
      Toast.remove(t);
      if (!res?.status) throw new Error(res?.message || "Failed to delete category!");
      Toast.success({ title: "Success", description: "Category deleted successfully!" });
      setDeleteId(null);
      router.refresh();
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to delete category!" });
    } finally {
      setIsDeleting(false);
    }
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
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Link href={`/admin/foods/categories/edit/${row.original._id}`}>
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
          searchPlaceholder='Search category...'
          noFoundMessage='No category found!'
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>Are you sure you want to delete this category? This action cannot be undone.</DialogDescription>
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

export default function ProductCategoryTable({ data, total }: ProductCategoryTableProps) {
  return (
    <Suspense fallback={<div className='p-4'>Loading...</div>}>
      <ProductCategoryTableInner data={data} total={total} />
    </Suspense>
  );
}
