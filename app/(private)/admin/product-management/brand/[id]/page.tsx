export default async function EditProductCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <p>ProudctCategory</p>
    </div>
  );
}
