# Organization API Documentation

This document describes the organization-related API endpoints that allow managing organizations and their members.

## Endpoints

### 1. Get Current User's Organization

**GET** `/api/org`

Fetches the organization details for the currently authenticated user.

#### Request

- **Authentication**: Required (Bearer token in header)
- **Body**: None

#### Response

- **Success (200)**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Organization Name"
  }
}
```

- **Errors**:
  - `401 UNAUTHORIZED`: User not authenticated
  - `404 NOT_FOUND`: User doesn't belong to an organization
  - `500 INTERNAL_SERVER_ERROR`: Server error

---

### 2. Update Organization

**PATCH** `/api/org/[orgId]`

Updates organization details (currently only name is supported).

#### Request

- **Authentication**: Required (Bearer token in header)
- **Authorization**: User must be `org-admin` of the target organization or `system-admin`
- **Path Parameters**:
  - `orgId`: UUID of the organization to update

- **Body**:

```json
{
  "name": "New Organization Name"
}
```

#### Response

- **Success (200)**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Organization Name",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

- **Errors**:
  - `401 UNAUTHORIZED`: User not authenticated
  - `403 FORBIDDEN`: User doesn't have permission to update this organization
  - `404 NOT_FOUND`: Organization not found
  - `422 VALIDATION_ERROR`: Invalid input data
  - `500 DATABASE_ERROR`: Database operation failed
  - `500 INTERNAL_SERVER_ERROR`: Server error

---

### 3. Get Organization Members

**GET** `/api/org/[orgId]/members`

Fetches all members of a specific organization.

#### Request

- **Authentication**: Required (Bearer token in header)
- **Authorization**: User must belong to the target organization or be `system-admin`
- **Path Parameters**:
  - `orgId`: UUID of the organization

#### Response

- **Success (200)**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "role": "org-admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid",
      "name": "Jane Smith",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "phoneNumber": null,
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

- **Errors**:
  - `401 UNAUTHORIZED`: User not authenticated
  - `403 FORBIDDEN`: User doesn't have permission to view this organization's members
  - `404 NOT_FOUND`: User profile not found
  - `500 DATABASE_ERROR`: Database operation failed
  - `500 INTERNAL_SERVER_ERROR`: Server error

---

### 4. Get Specific Organization Member

**GET** `/api/org/[orgId]/members/[memberId]`

Fetches details of a specific member within an organization.

#### Request

- **Authentication**: Required (Bearer token in header)
- **Authorization**: User must belong to the target organization or be `system-admin`
- **Path Parameters**:
  - `orgId`: UUID of the organization
  - `memberId`: UUID of the member to fetch

#### Response

- **Success (200)**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": "org-admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

- **Errors**:
  - `401 UNAUTHORIZED`: User not authenticated
  - `403 FORBIDDEN`: User doesn't have permission to view this organization's members
  - `404 NOT_FOUND`: Member not found in this organization
  - `500 INTERNAL_SERVER_ERROR`: Server error

---

## Authorization Matrix

| User Role | Get Org | Update Org | Get Members | Get Specific Member |
|-----------|---------|------------|-------------|-------------------|
| `user` | ✅ (own org) | ❌ | ✅ (own org) | ✅ (own org) |
| `org-admin` | ✅ (own org) | ✅ (own org) | ✅ (own org) | ✅ (own org) |
| `system-admin` | ✅ (any org) | ✅ (any org) | ✅ (any org) | ✅ (any org) |

## Data Types

### OrganizationMember

```typescript
interface OrganizationMember {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: 'user' | 'org-admin' | 'system-admin';
  createdAt: string;
  updatedAt: string;
}
```

### OrganizationContext

```typescript
interface OrganizationContext {
  id: string;
  name: string;
}
```

## Frontend Integration

### Organization Dashboard Page

A complete organization management page has been implemented at `/dashboard/organization` that provides:

#### Features:
- **Overview Tab**: View organization information, member count, and stats
- **Members Tab**: Display all organization members in a table with roles and join dates
- **Settings Tab**: Edit organization name (org-admin and system-admin only)

#### Key Components:
- Real-time member count and role distribution
- Inline editing for organization name with validation
- Responsive table view of all members with role badges
- Loading states and error handling
- Toast notifications for actions

#### Usage:
```typescript
// The page automatically fetches and displays:
// - Current user's organization data
// - List of all organization members
// - Organization statistics

// For admins, enables:
// - Organization name editing
// - Real-time updates via React Query
```

#### Navigation:
The organization page is accessible via the dashboard navigation at `/dashboard/organization` and requires authentication.

## Notes

- All timestamps are in ISO 8601 format (UTC)
- The `phoneNumber` field can be `null` if not provided
- Soft-deleted users are excluded from all member queries
- Members are ordered by creation date (ascending) in the list endpoint
- The API follows RESTful conventions and uses standard HTTP status codes
- All endpoints require authentication via session cookies or Bearer tokens
- Row Level Security (RLS) is enforced at the database level for additional security
- The frontend automatically invalidates auth context cache when organization is updated
