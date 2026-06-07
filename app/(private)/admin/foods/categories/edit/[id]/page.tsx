import { getProductCategoryById } from "@/actions/admin/product-management/product-category-actions";
import ProductCategoryForm from "@/components/admin/product-category/ProductCategoryForm";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getProductCategoryById(id);

  return (
    <div className='p-4'>
      <ProductCategoryForm category={response?.data} />
    </div>
  );
}
