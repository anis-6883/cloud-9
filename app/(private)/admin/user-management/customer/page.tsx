import { getCustomers } from "@/actions/admin/user-management/customer-actions";
import CustomerTable from "@/components/admin/customer/CustomerTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";

export default async function CustomerPage() {
  const res = await getCustomers();
  const data = res?.data || [];
  const total = data.length;

  return (
    <BreadcrumbWrapper
      title='Manage Customers'
      description='Organize and manage your customers'
      titleIcon={<Users className='text-xl' />}
      addBtn={
        <Link href='/admin/user-management/customer/create'>
          <Button size='sm' className='cool cursor-pointer'>
            <Plus className='mr-1 h-4 w-4' />
            Add New Customer
          </Button>
        </Link>
      }
    >
      <CustomerTable data={data} total={total} />
    </BreadcrumbWrapper>
  );
}
