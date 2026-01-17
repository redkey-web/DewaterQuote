'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Redirect, Product } from '@/db/schema';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProductOption {
  id: number;
  name: string;
  slug: string;
}

// New Redirect Form
interface RedirectFormNewProps {
  products?: ProductOption[];
}

export function RedirectFormNew({ products = [] }: RedirectFormNewProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fromPath: '',
    toPath: '',
    statusCode: '301',
    isActive: true,
    productId: '',
    expiresAt: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!formData.fromPath || !formData.toPath) {
      setError('From path and to path are required');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/redirects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPath: formData.fromPath,
          toPath: formData.toPath,
          statusCode: parseInt(formData.statusCode, 10),
          isActive: formData.isActive,
          productId: formData.productId ? parseInt(formData.productId, 10) : null,
          expiresAt: formData.expiresAt || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create redirect');
      }

      const data = await response.json();
      router.push('/admin/redirects/${data.id}');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create redirect');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Redirect Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fromPath">From Path *</Label>
              <Input
                id="fromPath"
                value={formData.fromPath}
                onChange={(e) => setFormData({ ...formData, fromPath: e.target.value })}
                required
                placeholder="/old-url"
              />
              <p className="text-xs text-gray-500">The URL path to redirect from (e.g., /old-product)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="toPath">To Path *</Label>
              <Input
                id="toPath"
                value={formData.toPath}
                onChange={(e) => setFormData({ ...formData, toPath: e.target.value })}
                required
                placeholder="/new-url or https://..."
              />
              <p className="text-xs text-gray-500">The destination URL (local path or full URL)</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="statusCode">Status Code</Label>
              <Select
                value={formData.statusCode}
                onValueChange={(value) => setFormData({ ...formData, statusCode: value })}
              >
                <SelectTrigger id="statusCode">
                  <SelectValue placeholder="Select status code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="301">301 - Permanent</SelectItem>
                  <SelectItem value="302">302 - Temporary</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">301 for permanent, 302 for temporary</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expires At</Label>
              <Input
                id="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
              <p className="text-xs text-gray-500">Optional expiration date</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">Active</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive" className="font-normal">
                  {formData.isActive ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>
          </div>

          {products.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="productId">Link to Product (Optional)</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) => setFormData({ ...formData, productId: value })}
              >
                <SelectTrigger id="productId">
                  <SelectValue placeholder="Select a product..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Optionally link this redirect to a product for tracking</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="sticky bottom-0 bg-white border-t p-4 -mx-6 mt-6 flex justify-between">
        <Link href="/admin/redirects">
          <Button type="button" variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Redirects
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/redirects')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Redirect
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

// Edit Redirect Form
interface RedirectFormEditProps {
  redirect: Redirect;
  products?: ProductOption[];
}

export function RedirectFormEdit({ redirect, products = [] }: RedirectFormEditProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fromPath: redirect.fromPath,
    toPath: redirect.toPath,
    statusCode: String(redirect.statusCode ?? 301),
    isActive: redirect.isActive ?? true,
    productId: redirect.productId ? String(redirect.productId) : '',
    expiresAt: redirect.expiresAt ? redirect.expiresAt.toISOString().split('T')[0] : '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!formData.fromPath || !formData.toPath) {
      setError('From path and to path are required');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/redirects/${redirect.id}', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPath: formData.fromPath,
          toPath: formData.toPath,
          statusCode: parseInt(formData.statusCode, 10),
          isActive: formData.isActive,
          productId: formData.productId ? parseInt(formData.productId, 10) : null,
          expiresAt: formData.expiresAt || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save redirect');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save redirect');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/redirects/${redirect.id}', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete redirect');
      }

      router.push('/admin/redirects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete redirect');
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Redirect Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fromPath">From Path *</Label>
              <Input
                id="fromPath"
                value={formData.fromPath}
                onChange={(e) => setFormData({ ...formData, fromPath: e.target.value })}
                required
                placeholder="/old-url"
              />
              <p className="text-xs text-gray-500">The URL path to redirect from</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="toPath">To Path *</Label>
              <Input
                id="toPath"
                value={formData.toPath}
                onChange={(e) => setFormData({ ...formData, toPath: e.target.value })}
                required
                placeholder="/new-url or https://..."
              />
              <p className="text-xs text-gray-500">The destination URL</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="statusCode">Status Code</Label>
              <Select
                value={formData.statusCode}
                onValueChange={(value) => setFormData({ ...formData, statusCode: value })}
              >
                <SelectTrigger id="statusCode">
                  <SelectValue placeholder="Select status code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="301">301 - Permanent</SelectItem>
                  <SelectItem value="302">302 - Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expires At</Label>
              <Input
                id="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">Active</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive" className="font-normal">
                  {formData.isActive ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>
          </div>

          {products.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="productId">Link to Product (Optional)</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) => setFormData({ ...formData, productId: value })}
              >
                <SelectTrigger id="productId">
                  <SelectValue placeholder="Select a product..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="sticky bottom-0 bg-white border-t p-4 -mx-6 mt-6 flex justify-between">
        <div className="flex gap-2">
          <Link href="/admin/redirects">
            <Button type="button" variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline" className="text-red-600 hover:text-red-700" disabled={deleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Redirect?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the redirect from {redirect.fromPath}.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/redirects')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
