import { getCustomerById } from "@/actions/admin/user-management/customer-actions";
import CustomerForm from "@/components/admin/customer/CustomerForm";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getCustomerById(id);

  return (
    <div className='p-4'>
      <CustomerForm customer={response?.data} />
    </div>
  );
}
