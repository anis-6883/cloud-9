import { getProductById } from "@/actions/admin/product-management/product-actions";
import ProductForm from "@/components/admin/product/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getProductById(id);

  return (
    <div className='p-4'>
      <ProductForm product={response?.data} />
    </div>
  );
}
