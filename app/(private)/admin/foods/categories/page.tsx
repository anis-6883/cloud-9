// import ProductCategoryForm from "@/components/admin/product-category/ProductCategoryForm";
import ProductCategoryTable from "@/components/admin/product-category/ProductCategorytable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { Grid3x3, Plus } from "lucide-react";
import Link from "next/link";
export default function CategoriesPage() {
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
      <ProductCategoryTable />
    </BreadcrumbWrapper>
  );
}
