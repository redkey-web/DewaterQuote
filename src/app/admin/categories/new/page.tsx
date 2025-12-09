import { CategoryFormNew } from '@/components/admin/CategoryForm';

export default function CategoryNewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
        <p className="text-gray-500">Create a new product category</p>
      </div>

      <CategoryFormNew />
    </div>
  );
}
