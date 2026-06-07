import ProductCategoryForm from "@/components/admin/product-category/ProductCategoryForm";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  return (
    <BreadcrumbWrapper title='Edit Categroy' description='Edit category'>
      <ProductCategoryForm />
    </BreadcrumbWrapper>
  );
}
