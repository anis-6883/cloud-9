import { getProducts } from "@/actions/admin/product-management/product-actions";
import ProductTable from "@/components/admin/product/ProductTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBasket } from "lucide-react";
import Link from "next/link";

export default async function ProductsPage() {
  const res = await getProducts();
  const data = res?.data?.docs || [];
  const total = res?.data?.pagination?.totalDocs || 0;

  return (
    <BreadcrumbWrapper
      title='Manage Products'
      description='Organize and manage your products'
      titleIcon={<ShoppingBasket className='text-xl' />}
      addBtn={
        <Link href='/admin/product-management/brand/create'>
          <Button size='sm' className='cool cursor-pointer'>
            <Plus className='mr-1 h-4 w-4' />
            Add New Product
          </Button>
        </Link>
      }
    >
      <ProductTable data={data} total={total} />
    </BreadcrumbWrapper>
  );
}
