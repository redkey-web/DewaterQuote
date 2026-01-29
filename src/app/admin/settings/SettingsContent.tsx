'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Database, Cloud, Mail, LogOut, Key, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface SettingsContentProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function SettingsContent({ user }: SettingsContentProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Client-side validation
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);

    if (!hasUppercase || !hasLowercase || !hasNumber) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || 'An error occurred');
        return;
      }

      setPasswordSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError('An error occurred. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

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
              <Input value={user?.email || ''} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={user?.name || 'Admin User'} disabled />
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

        {/* Change Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-gray-500" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Update your admin account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-md text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={passwordLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={passwordLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters with one uppercase, one lowercase, and one number.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={passwordLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </form>
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
                  <Mail className="h-5 w-5 text-sky-500" />
                  <div>
                    <p className="font-medium">Google Workspace SMTP</p>
                    <p className="text-sm text-gray-500">Contact Forms &amp; Quotes</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
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
