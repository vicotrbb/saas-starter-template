# Next.js SaaS Starter Template - Usage Instructions

This document provides detailed instructions on how to effectively use this Next.js SaaS starter template for rapidly developing modern web applications. These guidelines are intended for both developers and AI tools working with the codebase.

## Introduction

This template is built with modern technologies and best practices to accelerate the development of Software-as-a-Service (SaaS) applications. It includes pre-configured authentication, database integration, UI components, and payment processing, allowing you to focus on your unique application logic.

## Core Technologies

- **Framework**: Next.js 15 with App Router and React 19
- **Language**: TypeScript
- **Backend & Auth**: Supabase
- **UI Components**: Shadcn/UI (built on Radix UI)
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form with Zod
- **API & Data Fetching**: TanStack Query
- **Payments**: Stripe

## Getting Started

### Customization for Your Project

1. **Update package.json:**
   - Change `name`, `version`, and `homepage` to match your project

2. **Modify branding and metadata:**
   - Update `src/app/metadata.ts` with your project information
   - Add favicon and logos in `public/`
   - Update `README.md`

3. **Configure authentication:**
   - Set up Supabase auth providers in the Supabase dashboard
   - Customize auth forms in `src/app/auth/` if required.

4. **Set up database models:**
   - Define your database schema
   - Apply Row Level Security (RLS) policies to secure your data
   - Generate updated TypeScript types after schema changes

5. **Configure Stripe (if using payments):**
   - Set up products and prices in Stripe dashboard
   - Implement checkout flows and webhooks

## Project Structure Guidelines

Follow these guidelines when extending the template:

### Routing & Pages

- Use the Next.js App Router pattern:
  - Public pages go in `src/app/`
  - Protected user pages go in `src/app/dashboard/`
  - Admin pages go in `src/app/admin/`
  - API routes go in `src/app/api/`

### Components

- Place reusable UI components in `src/components/`
- Follow the component structure:

  ```
  components/
    ├── ui/ (Shadcn/UI components)
    ├── forms/ (Form components)
    ├── layout/ (Layout components)
    ├── guards/ (Guards components)
    ├── providers/ (Providers components)
    ├── seo/ (SEO related components)
    └── [feature]/ (Feature-specific components)
  ```

- Add new Shadcn/UI components:

  ```bash
  npx shadcn-ui@latest add [component-name]
  ```

### Data Management

- **Server Components**: Use server components for data fetching where possible
- **Client Components**: Use the TanStack Query for client-side data fetching
- **Forms**: Use React Hook Form with Zod for validation
- **Database Access**:
  - Use server-side Supabase client in server components and API routes
  - Use client-side Supabase client for authenticated client components

### Authentication

- Use the provided Supabase auth helpers:
  - Server-side: `src/lib/supabase/server-auth.ts`
  - Client-side: `src/lib/supabase/client-auth.ts`
  - Middleware: Already configured in `middleware.ts`

### API Development

- Create API routes in `src/app/api/`
- Use standardized response formats from `src/lib/api/responses.ts`
- Protect routes with middleware as needed
- Use Zod for request validation

### State Management

- Use React's built-in state management (useState, useContext)
- For global state, use the context providers in `src/contexts/`
- Use URL-based state for shareable UI state

## Best Practices

### Performance

- Use React Server Components by default
- Add `"use client"` only when necessary
- Optimize images using Next.js Image component
- Implement proper client-side data fetching strategies with TanStack Query

### Security

- Always use Row Level Security in Supabase
- Never expose sensitive keys or tokens on the client
- Validate all user inputs with Zod
- Protect API routes and pages with middleware

### Accessibility

- Use Shadcn/UI components which are built on Radix UI for accessibility
- Test with keyboard navigation
- Implement proper ARIA attributes where needed
- Ensure sufficient color contrast

### TypeScript

- Maintain strict type checking
- Use types generated from Supabase schema
- Create custom types in `src/types/` when needed
- Use Zod schemas to validate data and infer types

## Common Customization Tasks

### Adding New Pages

1. Create a new directory in the appropriate route group:

   ```
   src/app/dashboard/your-feature/
   ```

2. Add `page.tsx` for the main content:

   ```tsx
   export default function YourFeaturePage() {
     return (
       <div>
         <h1>Your Feature</h1>
         {/* Your content */}
       </div>
     );
   }
   ```

3. Optionally add `layout.tsx` for page-specific layouts

### Creating Database Tables

1. Define your table schema in a Supabase migration file
2. Apply Row Level Security (RLS) policies
3. Push the migration:

   ```bash
   supabase db push
   ```

4. Generate updated TypeScript types

### Adding Authentication Providers

1. Configure providers in the Supabase dashboard
2. Update the auth UI components in `src/app/auth/`

### Implementing Payments

1. Create products and prices in the Stripe dashboard
2. Implement checkout flows using the provided Stripe helpers
3. Set up webhook handlers in `src/app/api/stripe/webhooks/`

## Deployment

### Vercel Deployment

1. Push your code to a Git repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables

Ensure these variables are configured in your deployment environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CRON_SECRET_TOKEN`
- `NEXT_PUBLIC_APP_URL`

## Guidance for AI Tools

When working with this template, AI tools should:

1. **Maintain the project structure:**
   - Follow the established directory organization
   - Place components, hooks, and utilities in their designated locations

2. **Adhere to coding standards:**
   - Use TypeScript strictly
   - Follow React 19 and Next.js 15 best practices
   - Implement Server Components where appropriate
   - Add `"use client"` directive only when necessary

3. **Utilize existing patterns:**
   - Reuse authentication mechanisms
   - Follow established data fetching patterns
   - Use Shadcn/UI components
   - Leverage Tailwind CSS for styling

4. **Security awareness:**
   - Properly implement Row Level Security in database operations
   - Validate all inputs with Zod
   - Protect routes with middleware
   - Keep sensitive information server-side

5. **Database operations:**
   - Always use the appropriate Supabase client
   - Never use jsonb column type, prefer creating new tables and relationships
   - Design database to match the application domain
   - Prefer using code over SQL functions where possible

6. **Follow the provided architecture:**
   - Respect the multi-tenancy design if present
   - Implement proper error handling and logging
   - Use the provided API response formats
   - Follow accessibility guidelines

When extending the template, maintain consistency with the existing patterns and always prioritize type safety, security, and performance.
