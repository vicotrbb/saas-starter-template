'use client';

import { Suspense, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { OrganizationMembers } from '@/types/api.types';
import { toast } from 'sonner';
import { Pencil, Users, Building2, Calendar } from 'lucide-react';

function OrganizationSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-4 w-2/4" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
}

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case 'system-admin':
      return 'destructive';
    case 'org-admin':
      return 'default';
    case 'user':
      return 'secondary';
    default:
      return 'outline';
  }
}

function formatRole(role: string) {
  switch (role) {
    case 'system-admin':
      return 'System Admin';
    case 'org-admin':
      return 'Organization Admin';
    case 'user':
      return 'User';
    default:
      return role;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function OrganizationContent() {
  const { userData, organizationData, isUserDataLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [orgName, setOrgName] = useState('');
  const queryClient = useQueryClient();

  // Set initial organization name when organizationData is available
  useState(() => {
    if (organizationData?.name) {
      setOrgName(organizationData.name);
    }
  });

  // Fetch organization members
  const {
    data: members = [],
    isLoading: membersLoading,
    error: membersError,
  } = useQuery({
    queryKey: ['organization-members'],
    queryFn: () => apiClient.get<OrganizationMembers>(`org/${organizationData?.id}/members`),
    enabled: !!organizationData?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update organization mutation
  const updateOrgMutation = useMutation({
    mutationFn: (data: { name: string }) => apiClient.patch(`org/${organizationData?.id}`, data),
    onSuccess: () => {
      toast.success('Organization updated successfully');
      setIsEditing(false);
      // Invalidate auth context to refresh organization data
      queryClient.invalidateQueries({ queryKey: ['authContext'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update organization');
    },
  });

  const handleUpdateOrganization = () => {
    if (!orgName.trim()) {
      toast.error('Organization name is required');
      return;
    }
    updateOrgMutation.mutate({ name: orgName.trim() });
  };

  const handleCancelEdit = () => {
    setOrgName(organizationData?.name || '');
    setIsEditing(false);
  };

  const isOrgAdmin = userData?.role === 'org-admin' || userData?.role === 'system-admin';

  if (!userData || isUserDataLoading) {
    return <OrganizationSkeleton />;
  }

  if (!organizationData) {
    return (
      <div className="container space-y-8 p-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
          <p className="text-muted-foreground">You are not part of any organization.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-8 p-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and view team members.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          {isOrgAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Organization Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Information
              </CardTitle>
              <CardDescription>
                View your organization details and current membership.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input value={organizationData.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Your Role</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={getRoleBadgeVariant(userData.role)}>
                      {formatRole(userData.role)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Total Members</Label>
                  <div className="flex items-center gap-2">
                    <Users className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">
                      {membersLoading ? '...' : members.length} member
                      {members.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">
                      {members.find((m) => m.id === userData?.id)?.createdAt
                        ? formatDate(members.find((m) => m.id === userData?.id)!.createdAt)
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Stats</CardTitle>
              <CardDescription>Quick overview of your organization.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 text-center">
                  <div className="text-primary text-2xl font-bold">
                    {membersLoading ? '...' : members.length}
                  </div>
                  <div className="text-muted-foreground text-sm">Total Members</div>
                </div>
                <div className="space-y-2 text-center">
                  <div className="text-primary text-2xl font-bold">
                    {membersLoading ? '...' : members.filter((m) => m.role === 'org-admin').length}
                  </div>
                  <div className="text-muted-foreground text-sm">Admins</div>
                </div>
                <div className="space-y-2 text-center">
                  <div className="text-primary text-2xl font-bold">
                    {membersLoading ? '...' : members.filter((m) => m.role === 'user').length}
                  </div>
                  <div className="text-muted-foreground text-sm">Regular Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Organization Members
              </CardTitle>
              <CardDescription>View and manage all members in your organization.</CardDescription>
            </CardHeader>
            <CardContent>
              {membersLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : membersError ? (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground">Failed to load members</p>
                </div>
              ) : members.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground">No members found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(member.role)}>
                            {formatRole(member.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>{member.phoneNumber || '—'}</TableCell>
                        <TableCell>{formatDate(member.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isOrgAdmin && (
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pencil className="h-5 w-5" />
                  Organization Settings
                </CardTitle>
                <CardDescription>
                  Update your organization information and settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <div className="flex gap-2">
                      <Input
                        id="org-name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter organization name"
                      />
                      {!isEditing ? (
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                          className="flex-shrink-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      ) : (
                        <div className="flex flex-shrink-0 gap-2">
                          <Button
                            onClick={handleUpdateOrganization}
                            disabled={updateOrgMutation.isPending}
                            size="sm"
                          >
                            {updateOrgMutation.isPending ? 'Saving...' : 'Save'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={updateOrgMutation.isPending}
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default function OrganizationPage() {
  return (
    <Suspense fallback={<OrganizationSkeleton />}>
      <OrganizationContent />
    </Suspense>
  );
}
