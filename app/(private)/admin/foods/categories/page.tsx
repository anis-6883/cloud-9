import { getProductCategories } from "@/actions/admin/product-management/product-category-actions";
import ProductCategoryTable from "@/components/admin/product-category/ProductCategorytable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { Grid3x3, Plus } from "lucide-react";
import Link from "next/link";

export default async function CategoriesPage() {
  const res = await getProductCategories();
  const data = res?.data || [];

  return (
    <BreadcrumbWrapper
      title='Manage Category'
      description='Organize and manage your category'
      titleIcon={<Grid3x3 className='text-xl' />}
      addBtn={
        <Link href={routes.privateRoutes.admin.productManagement.productCategory.create}>
          <Button size='sm' className='cool cursor-pointer'>
            <Plus className='mr-1 h-4 w-4' />
            Add New Category
          </Button>
        </Link>
      }
    >
      <ProductCategoryTable data={data} total={data.length} />
    </BreadcrumbWrapper>
  );
}
