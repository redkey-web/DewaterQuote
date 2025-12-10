'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Database, Cloud, Mail, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and application settings</p>
      </div>

      <div className="grid gap-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <CardTitle>Account</CardTitle>
            </div>
            <CardDescription>Your admin account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={session?.user?.email || ''} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={session?.user?.name || 'Admin User'} disabled />
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-500" />
              <CardTitle>Services Status</CardTitle>
            </div>
            <CardDescription>Connected services and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Neon Postgres</p>
                    <p className="text-sm text-gray-500">Database</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Cloud className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Vercel Blob</p>
                    <p className="text-sm text-gray-500">File Storage</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">NextAuth.js</p>
                    <p className="text-sm text-gray-500">Authentication</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Email (SendGrid)</p>
                    <p className="text-sm text-gray-500">Contact Forms</p>
                  </div>
                </div>
                <Badge variant="secondary">Not Configured</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
            <CardDescription>Current deployment information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Vercel Environment</p>
                <p className="font-medium capitalize">{process.env.NEXT_PUBLIC_VERCEL_ENV || 'local'}</p>
              </div>
              <div>
                <p className="text-gray-500">Build</p>
                <p className="font-medium">Next.js 15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Users Note */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
            <CardDescription>Managing admin access</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              To create a new admin user, run the following command on your server:
            </p>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
              npx tsx scripts/create-admin.ts email@example.com YourPassword &quot;Name&quot;
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
