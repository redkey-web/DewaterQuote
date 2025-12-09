import { BrandFormNew } from '@/components/admin/BrandForm';

export default function BrandNewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Brand</h1>
        <p className="text-gray-500">Create a new product brand</p>
      </div>

      <BrandFormNew />
    </div>
  );
}
