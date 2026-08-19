export default async function SingleCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <p>Single Customer Page</p>
    </div>
  );
}
