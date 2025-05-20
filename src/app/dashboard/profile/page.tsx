'use client';

import { Suspense } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getInitials } from '@/lib/utils';

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-4 w-2/4" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  );
}

function ProfileContent() {
  const { user, userData, organizationData, isUserDataLoading } = useAuth();

  if (!user || isUserDataLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="container space-y-8 p-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set your preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {/* Extensibility: Add more tabs here */}
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information and email address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {getInitials(userData?.name || user.email || '')}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Avatar</Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" defaultValue={userData?.name || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    defaultValue={user.email || ''}
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Organization Card - if part of an organization */}
          {organizationData && (
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>Your organization details and role.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input value={organizationData.name} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Role</Label>
                    <Input value={userData?.role || 'Member'} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Extensibility: Add more sections here */}
          {/* Example:
          <Card>
            <CardHeader>
              <CardTitle>Custom Section</CardTitle>
              <CardDescription>Add your custom content here.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Your custom content */}
          {/* </CardContent>
          </Card>
          */}
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks on your device.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add appearance settings here */}
              <p className="text-muted-foreground text-sm">Appearance settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what notifications you want to receive.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add notification settings here */}
              <p className="text-muted-foreground text-sm">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
