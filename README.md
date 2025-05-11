# Next.js SaaS Starter Template

A feature-rich, opinionated Next.js 15 (App Router) + Supabase SaaS starter template designed to accelerate the development of modern web applications. Built with TypeScript, Tailwind CSS, Shadcn/UI, Stripe, and more.

**Note:** This README is an initial draft. Please review and expand with more project-specific details.

## Table of Contents

- [Overview](#overview)
- [Core Technologies](#core-technologies)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Project Structure](#project-structure)
- [Key Functionalities](#key-functionalities)
  - [Authentication](#authentication)
  - [Database](#database)
  - [API Routes](#api-routes)
  - [UI & Styling](#ui--styling)
  - [Payments](#payments)
  - [Cron Jobs](#cron-jobs)
- [Environment Variables](#environment-variables)
- [Linting & Formatting](#linting--formatting)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

This template provides a solid foundation for building Software-as-a-Service (SaaS) applications. It includes common features like user authentication, database integration, API routes, UI components, and payment processing, allowing you to focus on your unique application logic.

It leverages the latest Next.js (App Router) features for optimal performance and developer experience, combined with Supabase for a powerful and easy-to-use backend.

## Core Technologies

- **Framework**: [Next.js](https://nextjs.org/) 15 (App Router, Turbopack enabled for dev)
- **React**: [React](https://react.dev/) 19
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & Auth**: [Supabase](https://supabase.io/) (Database, Auth, Storage)
  - `@supabase/auth-helpers-nextjs`
  - `@supabase/supabase-js`
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
  - Built on [Radix UI](https://www.radix-ui.com/) & [Tailwind CSS](https://tailwindcss.com/)
  - `lucide-react` for icons
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
- **API & Client Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Payments**: [Stripe](https://stripe.com/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Linting**: [ESLint](https://eslint.org/)
- **Formatting**: [Prettier](https://prettier.io/)
- **Potentially AI**: `openai` package included

## Features

- **Next.js App Router**: Modern routing and server components.
- **Supabase Integration**:
  - User authentication (email/password, OAuth providers - configurable).
  - PostgreSQL database with type-safe client via generated types (`src/types/database.types.ts`).
  - Server-side and client-side Supabase clients.
  - Middleware for route protection.
- **Shadcn/UI Components**: A comprehensive set of beautiful and accessible UI components.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Stripe Payments**: Pre-configured for handling subscriptions or one-time payments (requires further implementation).
- **API Routes**: Well-structured backend endpoints using Next.js Route Handlers.
  - Standardized API responses (`src/lib/api/responses.ts`).
- **Form Handling**: Efficient and type-safe forms with React Hook Form and Zod.
- **Client-side Data Caching**: Using TanStack Query.
- **Cron Job Support**: Securely trigger scheduled tasks via API endpoints (e.g., `/api/cron/...`).
- **TypeScript**: End-to-end type safety.
- **SEO Basics**: Sitemap and robots.txt generation helpers.
- **Environment Variable Management**: Clear separation with `.env.example` and `.env.local`.
- **Linting & Formatting**: Pre-configured for code consistency.
- **Admin Dashboard (Scaffolding)**: `/admin` route group.
- **User Dashboard (Scaffolding)**: `/dashboard` route group.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [pnpm](https://pnpm.io/) (recommended), `npm`, or `yarn`
- A [Supabase](https://supabase.com/) account and project.
- A [Stripe](https://stripe.com/) account (if using payment features).

### Setup

1. **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2. **Install dependencies:**

    ```bash
    pnpm install
    # or
    # npm install
    # or
    # yarn install
    ```

3. **Set up Environment Variables:**
    Copy the example environment file and fill in your project-specific values:

    ```bash
    cp .env.example .env.local
    ```

    You will need to populate this file with your Supabase URL, anon key, service role key (if used by `src/lib/supabase/admin.ts`), Stripe keys, and other necessary secrets. See the [Environment Variables](#environment-variables) section for more details.

4. **Supabase Database Setup:**
    - It's recommended to use Supabase CLI for managing migrations.
    - Apply any existing database migrations located in the `migrations/` directory.

      ```bash
      # If using Supabase CLI and project is linked
      supabase db push
      ```

    - Ensure your database schema matches what's expected by the application, particularly for tables used by authentication and other features.
    - Generate TypeScript types from your Supabase schema if you make changes:

      ```bash
      # Install Supabase CLI if you haven't: npm install supabase --save-dev
      # Login: supabase login
      # Link project: supabase link --project-ref <your-project-ref>
      supabase gen types typescript --project-id <your-project-ref> --schema public > src/types/database.types.ts
      ```

5. **Run the development server:**

    ```bash
    pnpm dev
    # or
    # npm run dev
    # or
    # yarn dev
    ```

    The application should now be running on `http://localhost:3000`.

## Project Structure

Here's a brief overview of the key directories:

- `src/app/`: Contains all routes, pages, and layouts (App Router).
  - `src/app/api/`: API Route Handlers.
  - `src/app/(auth)/`: Authentication-related pages (login, signup).
  - `src/app/dashboard/`: User dashboard pages.
  - `src/app/admin/`: Admin-specific pages.
  - `src/app/layout.tsx`: Root application layout.
  - `src/app/page.tsx`: Main landing page.
- `src/components/`: Shared UI components, likely leveraging Shadcn/UI.
  - `src/components/ui/`: Auto-generated Shadcn/UI components.
- `src/lib/`: Utility functions, Supabase client setup, Stripe integration, etc.
  - `src/lib/supabase/`: Supabase client instances and auth helpers.
  - `src/lib/stripe/`: Stripe client and helper functions.
  - `src/lib/api/`: API helper functions (e.g., `responses.ts`).
- `src/types/`: TypeScript type definitions, including `database.types.ts` for Supabase schema.
- `public/`: Static assets.
- `migrations/`: Supabase database migration files.
- `middleware.ts`: Next.js middleware for request processing (e.g., auth, redirects).
- `components.json`: Shadcn/UI configuration.
- `next.config.ts`: Next.js configuration.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `tsconfig.json`: TypeScript configuration.

## Key Functionalities

### Authentication

- Managed by Supabase Auth.
- Client-side helpers in `src/lib/supabase/client-auth.ts`.
- Server-side helpers in `src/lib/supabase/server-auth.ts` (for Server Components and Route Handlers).
- Middleware (`middleware.ts`) protects routes and handles redirects for unauthenticated users.
- Auth pages are typically located in `src/app/(auth)/`.

### Database

- Supabase PostgreSQL database.
- Type-safe database client using types generated from your schema (`src/types/database.types.ts`).
- Recommended to manage schema changes via Supabase Migrations.
- Ensure Row Level Security (RLS) is enabled on your Supabase tables for proper data protection.

### API Routes

- Located in `src/app/api/`.
- Follow Next.js Route Handler conventions.
- Standardized JSON responses using helpers from `src/lib/api/responses.ts` (as per `base-instructions.mdc`).
- Protected by middleware where necessary.

### UI & Styling

- **Shadcn/UI**: Leverages Radix UI primitives and Tailwind CSS for a comprehensive set of customizable components.
  - Add new components using the Shadcn/UI CLI: `npx shadcn-ui@latest add <component_name>`
- **Tailwind CSS**: Utility-first styling. Configuration in `tailwind.config.ts`.
- Global styles in `src/app/globals.css`.

### Payments

- Integrated with Stripe via `@stripe/stripe-js` (client-side) and `stripe` (server-side).
- Stripe client setup likely in `src/lib/stripe/`.
- API endpoints for Stripe operations (e.g., creating checkout sessions, handling webhooks) in `src/app/api/stripe/`.
- Remember to configure Stripe webhooks in your Stripe dashboard and handle them appropriately.

### Cron Jobs

- Support for scheduled tasks via API endpoints in `src/app/api/cron/`.
- These endpoints are protected by a `CRON_SECRET_TOKEN` environment variable, checked in `middleware.ts`.

## Environment Variables

Environment variables are crucial for configuring the application. Copy `.env.example` to `.env.local` and fill in the required values.

Key variables include:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anon key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase project service role key (use with caution, primarily for admin tasks or specific server-side operations).
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key.
- `STRIPE_SECRET_KEY`: Your Stripe secret key.
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret.
- `CRON_SECRET_TOKEN`: A secret token to authorize cron job requests.
- `NEXT_PUBLIC_APP_URL`: The public URL of your application (e.g., `http://localhost:3000` for dev, `https://yourdomain.com` for prod).

**Important**: Never commit your `.env.local` file or other files containing secrets to version control. The `.gitignore` file should already be configured to ignore it.

## Linting & Formatting

- **ESLint**: Configured for code quality and consistency. Run with `pnpm lint`.
- **Prettier**: Used for code formatting. It's recommended to set up format-on-save in your editor.
  - A Prettier configuration file (`.prettierrc`) is included.
  - `prettier-plugin-tailwindcss` is used for sorting Tailwind classes.

## Deployment

This template is optimized for deployment on [Vercel](https://vercel.com/), the creators of Next.js.

1. Push your code to a Git repository (e.g., GitHub, GitLab, Bitbucket).
2. Connect your repository to Vercel.
3. Configure the Environment Variables in your Vercel project settings. These should match the ones in your `.env.local` file.
4. Vercel will typically auto-detect the Next.js framework and build settings.
5. Deploy!

Ensure your Supabase instance is publicly accessible and configured correctly for the deployed application. For Stripe, ensure you are using live keys and your webhook endpoints are correctly configured in the Stripe dashboard.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
