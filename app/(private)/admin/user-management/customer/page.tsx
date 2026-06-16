import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
export default function CustomerPage() {
  return (
    <BreadcrumbWrapper
      title='Manage Products'
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
      <p>Customers</p>
    </BreadcrumbWrapper>
  );
}
