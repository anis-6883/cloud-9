"use client";

import { deleteCustomer } from "@/actions/admin/user-management/customer-actions";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import Toast from "@/components/shared/Toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Customer } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

interface CustomerTableProps {
  data: Customer[];
  total: number;
}

function CustomerTableInner({ data, total }: CustomerTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const t = Toast.loading({ title: "Status", description: "Deleting customer..." });
    try {
      const res = (await deleteCustomer(deleteId)) as any;
      Toast.remove(t);
      if (!res?.status) throw new Error(res?.message || "Failed to delete customer!");
      Toast.success({ title: "Success", description: "Customer deleted successfully!" });
      setDeleteId(null);
      router.refresh();
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to delete customer!" });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Customer>[] = [
    {
      header: "SL",
      cell: ({ row }) => (page - 1) * limit + row.index + 1
    },
    {
      header: "Image",
      cell: ({ row }) => (
        <Avatar className='h-10 w-10 rounded-full'>
          <AvatarImage src={row.original.image?.secureUrl} alt={row.original.name} className='object-cover' />
          <AvatarFallback className='rounded-full'>{row.original.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )
    },
    {
      accessorKey: "name",
      header: "Name"
    },
    {
      accessorKey: "email",
      header: "Email"
    },
    {
      header: "Phone",
      cell: ({ row }) =>
        row.original.phone ? (
          <span>
            {row.original.dialCode} {row.original.phone}
          </span>
        ) : (
          <span className='text-muted-foreground'>—</span>
        )
    },
    {
      accessorKey: "dob",
      header: "Date of Birth",
      cell: ({ row }) =>
        row.original.dob ? new Date(row.original.dob).toLocaleDateString() : <span className='text-muted-foreground'>—</span>
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
      header: "Joined",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Link href={`/admin/user-management/customer/edit/${row.original._id}`}>
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
          searchPlaceholder='Search customer...'
          noFoundMessage='No customer found!'
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>Are you sure you want to delete this customer? This action cannot be undone.</DialogDescription>
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

export default function CustomerTable({ data, total }: CustomerTableProps) {
  return (
    <Suspense fallback={<div className='p-4'>Loading...</div>}>
      <CustomerTableInner data={data} total={total} />
    </Suspense>
  );
}
