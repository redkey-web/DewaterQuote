import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/config';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';

export const metadata = {
  title: 'Admin - Dewater Products',
  robots: 'noindex, nofollow',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Allow login page without session
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminLayoutWrapper>
        <AdminHeader user={session.user} />
        <main className="p-6">{children}</main>
      </AdminLayoutWrapper>
    </div>
  );
}
