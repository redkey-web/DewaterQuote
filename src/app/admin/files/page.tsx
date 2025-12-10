import { db } from '@/db';
import { productImages, productDownloads, products } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileImage, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

async function getImages() {
  try {
    return await db.query.productImages.findMany({
      with: {
        product: true,
      },
      orderBy: [desc(productImages.id)],
    });
  } catch (error) {
    console.error('Failed to get images:', error);
    return [];
  }
}

async function getDownloads() {
  try {
    return await db.query.productDownloads.findMany({
      with: {
        product: true,
      },
      orderBy: [desc(productDownloads.id)],
    });
  } catch (error) {
    console.error('Failed to get downloads:', error);
    return [];
  }
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function FilesPage() {
  const [images, downloads] = await Promise.all([getImages(), getDownloads()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Files</h1>
        <p className="text-gray-500">
          View all uploaded images and documents. Files are stored in Vercel Blob.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileImage className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{images.length}</p>
              <p className="text-sm text-gray-500">Images</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{downloads.length}</p>
              <p className="text-sm text-gray-500">Documents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileImage className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{images.length + downloads.length}</p>
              <p className="text-sm text-gray-500">Total Files</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="images" className="w-full">
        <TabsList>
          <TabsTrigger value="images">
            <FileImage className="h-4 w-4 mr-2" />
            Images ({images.length})
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents ({downloads.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="mt-4">
          {images.length === 0 ? (
            <div className="border rounded-lg bg-white p-8 text-center text-gray-500">
              No images uploaded yet. Add images from the product edit page.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="bg-white border rounded-lg overflow-hidden group">
                  <div className="aspect-square relative bg-gray-100">
                    {image.url ? (
                      <Image
                        src={image.url}
                        alt={image.alt || 'Product image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FileImage className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    {image.isPrimary && (
                      <Badge className="absolute top-2 left-2 bg-blue-600">Primary</Badge>
                    )}
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Button size="sm" variant="secondary">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate" title={image.alt || undefined}>
                      {image.alt || 'No alt text'}
                    </p>
                    {image.product && (
                      <Link
                        href={`/admin/products/${image.product.id}`}
                        className="text-xs text-blue-600 hover:underline truncate block"
                      >
                        {image.product.name}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="border rounded-lg bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downloads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No documents uploaded yet. Add documents from the product edit page.
                    </TableCell>
                  </TableRow>
                ) : (
                  downloads.map((download) => (
                    <TableRow key={download.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-red-500" />
                          <span className="font-medium">{download.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {download.product ? (
                          <Link
                            href={`/admin/products/${download.product.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {download.product.name}
                          </Link>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {download.fileType || 'pdf'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(download.fileSize)}</TableCell>
                      <TableCell className="text-right">
                        <a href={download.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
