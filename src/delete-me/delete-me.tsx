import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Database, Terminal, DollarSign, Rocket, Layers, Puzzle } from 'lucide-react';

const features = [
  {
    category: 'Core Framework & UI',
    icon: <Layers className="mb-2 h-8 w-8 text-blue-500" />,
    items: [
      {
        name: 'Next.js 15',
        description:
          'Leveraging the App Router, React Server Components, and Turbopack for bleeding-edge performance and developer experience.',
        tags: ['Next.js', 'App Router', 'RSC'],
      },
      {
        name: 'React 19',
        description: 'Utilizing the latest React features for building modern user interfaces.',
        tags: ['React'],
      },
      {
        name: 'Shadcn/UI & Radix UI',
        description:
          'Beautifully designed, accessible, and customizable components built on Radix UI primitives.',
        tags: ['Shadcn/UI', 'Radix UI'],
      },
      {
        name: 'Tailwind CSS v4',
        description: 'A utility-first CSS framework for rapid and consistent UI development.',
        tags: ['Tailwind CSS'],
      },
      { name: 'Lucide Icons', description: 'Simply beautiful open-source icons.', tags: ['Icons'] },
    ],
  },
  {
    category: 'Backend & Database',
    icon: <Database className="mb-2 h-8 w-8 text-green-500" />,
    items: [
      {
        name: 'Supabase',
        description:
          'The open-source Firebase alternative. Handles database, authentication, and storage.',
        tags: ['Supabase', 'PostgreSQL'],
      },
      {
        name: 'Supabase Auth',
        description:
          'Robust authentication with email/password, OAuth, and server-side/client-side helpers. Includes middleware for route protection.',
        tags: ['Authentication', 'Security'],
      },
      {
        name: 'Type-Safe Database Client',
        description:
          'Auto-generated TypeScript types for your Supabase schema, ensuring type safety in queries.',
        tags: ['TypeScript', 'Database'],
      },
      {
        name: 'Row Level Security (RLS)',
        description:
          'Pre-configured for Supabase, ensuring data is secure and only accessible by authorized users.',
        tags: ['Security', 'Best Practice'],
      },
    ],
  },
  {
    category: 'API & Data Handling',
    icon: <Zap className="mb-2 h-8 w-8 text-yellow-500" />,
    items: [
      {
        name: 'Next.js Route Handlers',
        description:
          'Build robust and scalable backend APIs directly within your Next.js application.',
        tags: ['API', 'Backend'],
      },
      {
        name: 'Standardized API Responses',
        description:
          'Consistent API response structure using custom helpers (`src/lib/api/responses.ts`).',
        tags: ['API', 'Best Practice'],
      },
      {
        name: 'TanStack Query (React Query)',
        description:
          'Powerful asynchronous state management for fetching, caching, and updating data on the client.',
        tags: ['Data Fetching', 'State Management'],
      },
      {
        name: 'React Hook Form & Zod',
        description: 'Efficient, type-safe form handling and validation.',
        tags: ['Forms', 'Validation', 'TypeScript'],
      },
    ],
  },
  {
    category: 'Payments & Monetization',
    icon: <DollarSign className="mb-2 h-8 w-8 text-purple-500" />,
    items: [
      {
        name: 'Stripe Integration',
        description:
          'Ready-to-use Stripe setup for processing payments, managing subscriptions, and handling webhooks.',
        tags: ['Stripe', 'Payments', 'SaaS'],
      },
    ],
  },
  {
    category: 'Development & Tooling',
    icon: <Terminal className="mb-2 h-8 w-8 text-gray-500" />,
    items: [
      {
        name: 'TypeScript',
        description: 'End-to-end type safety for robust and maintainable code.',
        tags: ['TypeScript'],
      },
      {
        name: 'ESLint & Prettier',
        description:
          'Pre-configured for consistent code style and quality, including Tailwind CSS class sorting.',
        tags: ['Linting', 'Formatting'],
      },
      {
        name: 'Turbopack (Dev)',
        description: 'Blazing fast Rust-based bundler for Next.js development.',
        tags: ['Performance', 'DX'],
      },
      {
        name: 'Cron Jobs',
        description:
          'Securely trigger scheduled tasks via dedicated API endpoints, protected by a secret token.',
        tags: ['Automation', 'Scheduled Tasks'],
      },
      {
        name: 'Vercel Analytics',
        description: 'Track website performance and user engagement with ease.',
        tags: ['Analytics'],
      },
    ],
  },
  {
    category: 'Application Structure',
    icon: <Puzzle className="mb-2 h-8 w-8 text-indigo-500" />,
    items: [
      {
        name: 'Modular Architecture',
        description:
          'Well-organized project structure with clear separation of concerns (App Router, components, lib).',
        tags: ['Scalability', 'Maintainability'],
      },
      {
        name: 'Admin & User Dashboards',
        description: 'Scaffolding for distinct admin and user-specific areas of your application.',
        tags: ['SaaS', 'Multi-tenancy'],
      },
      {
        name: 'SEO Basics',
        description: 'Includes helpers for `sitemap.xml` and `robots.txt` generation.',
        tags: ['SEO'],
      },
    ],
  },
];

export function DeleteMeHomepage() {
  return (
    <div className="from-background to-background/80 text-foreground min-h-screen bg-gradient-to-br p-4 md:p-8">
      <header className="mb-12 pt-10 text-center">
        <Rocket className="text-primary mx-auto mb-4 h-16 w-16" />
        <h1 className="from-primary to-primary/80 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Next.js SaaS Starter Template
        </h1>
        <p className="text-muted-foreground mx-auto max-w-3xl text-lg md:text-xl">
          Jumpstart your next SaaS application with this feature-packed template, built with the
          latest technologies for optimal performance and developer joy.
        </p>
      </header>

      <main className="space-y-12">
        {features.map((categoryFeature) => (
          <section key={categoryFeature.category}>
            <div className="mb-6 flex items-center justify-center">
              {categoryFeature.icon}
              <h2 className="ml-3 text-center text-3xl font-semibold">
                {categoryFeature.category}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryFeature.items.map((feature) => (
                <Card
                  key={feature.name}
                  className="border-border bg-card/70 hover:shadow-primary/30 shadow-sm transition-shadow duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center text-xl">
                      {feature.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>

      <section className="mt-12 space-y-6">
        <div className="mb-6 flex items-center justify-center">
          <h2 className="ml-3 text-center text-3xl font-semibold">How to Use This Template</h2>
        </div>
        <Card className="border-border bg-card/70 shadow-sm">
          <CardContent className="space-y-8">
            <p className="text-muted-foreground">
              This Next.js SaaS Starter Template is designed to get your project up and running
              quickly. Here&apos;s a breakdown of how to utilize it effectively:
            </p>

            <div>
              <h3 className="text-primary mb-3 text-xl font-semibold">1. Prerequisites</h3>
              <p className="text-muted-foreground">
                Ensure you have Node.js (v18+), pnpm (or npm/yarn), a Supabase account, and a Stripe
                account (if you plan to use payment features).
              </p>
            </div>

            <div>
              <h3 className="text-primary mb-3 text-xl font-semibold">2. Clone & Install</h3>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                <li>
                  Clone your repository:{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    git clone {'<'}your-repository-url{'>'}
                  </code>
                </li>
                <li>
                  Navigate into the project directory:{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    cd {'<'}repository-name{'>'}
                  </code>
                </li>
                <li>
                  Install dependencies:{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    pnpm install
                  </code>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-primary mb-3 text-xl font-semibold">3. Environment Setup</h3>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                <li>
                  Copy the example environment file:{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    cp .env.example .env.local
                  </code>
                </li>
                <li>
                  Fill in{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    .env.local
                  </code>{' '}
                  with your Supabase URL and keys, Stripe keys, cron secret, and your
                  application&apos;s public URL.{' '}
                  <strong className="text-foreground">
                    Never commit{' '}
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                      .env.local
                    </code>{' '}
                    to version control.
                  </strong>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-primary mb-3 text-xl font-semibold">
                4. Database Setup (Supabase)
              </h3>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                <li>
                  Use the Supabase CLI for managing database migrations (located in the{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    migrations/
                  </code>{' '}
                  directory).
                </li>
                <li>
                  If your Supabase project is linked, run{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    supabase db push
                  </code>{' '}
                  to apply migrations.
                </li>
                <li>Ensure Row Level Security (RLS) is enabled on your tables.</li>
                <li>
                  If you modify the schema, regenerate TypeScript types:{' '}
                  <code className="bg-muted text-foreground block rounded p-2 font-mono text-sm whitespace-pre-wrap">
                    supabase gen types typescript --project-id {'<'}your-project-ref{'>'} --schema
                    public {' > '} src/types/database.types.ts
                  </code>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-primary mb-3 text-xl font-semibold">5. Run Development Server</h3>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                <li>
                  Execute{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    pnpm dev
                  </code>
                  .
                </li>
                <li>
                  The application will be available at{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    http://localhost:3000
                  </code>
                  .
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-primary mb-3 text-xl font-semibold">
                Key Project Structure Areas
              </h3>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                <li>
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    src/app/
                  </code>
                  : Contains all routes, pages, and layouts (App Router).
                  <ul className="list-circle space-y-1 pt-1 pl-5">
                    <li>
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                        api/
                      </code>
                      : API Route Handlers.
                    </li>
                    <li>
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                        (auth)/
                      </code>
                      : Authentication-related pages.
                    </li>
                    <li>
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                        dashboard/
                      </code>
                      : User dashboard pages.
                    </li>
                    <li>
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                        admin/
                      </code>
                      : Admin-specific pages.
                    </li>
                  </ul>
                </li>
                <li>
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    src/components/
                  </code>
                  : Shared UI components, including Shadcn/UI components in{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    ui/
                  </code>
                  .
                </li>
                <li>
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    src/lib/
                  </code>
                  : Utility functions, Supabase client ({' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    supabase/
                  </code>
                  ), Stripe integration ({' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    stripe/
                  </code>
                  ), and API helpers ({' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    api/responses.ts
                  </code>
                  ).
                </li>
                <li>
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    src/types/
                  </code>
                  : TypeScript definitions, including{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    database.types.ts
                  </code>{' '}
                  for Supabase.
                </li>
                <li>
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    migrations/
                  </code>
                  : Supabase database migration files.
                </li>
                <li>
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    middleware.ts
                  </code>
                  : Next.js middleware for auth, redirects, and cron job protection.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-primary mb-3 text-xl font-semibold">Core Features to Leverage</h3>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                <li>
                  <strong>Authentication</strong>: Supabase Auth is pre-configured with client and
                  server helpers, plus route protection via{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    middleware.ts
                  </code>
                  .
                </li>
                <li>
                  <strong>Database</strong>: Utilize the type-safe Supabase client.
                </li>
                <li>
                  <strong>API Routes</strong>: Build your backend in{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    src/app/api/
                  </code>{' '}
                  using standardized responses.
                </li>
                <li>
                  <strong>UI & Styling</strong>: Use Shadcn/UI (add components with{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    npx shadcn-ui@latest add {'<'}component_name{'>'}
                  </code>
                  ) and Tailwind CSS.
                </li>
                <li>
                  <strong>Payments</strong>: Stripe integration is ready for client and server-side
                  operations.
                </li>
                <li>
                  <strong>Cron Jobs</strong>: Securely run scheduled tasks via{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    src/app/api/cron/
                  </code>{' '}
                  endpoints, protected by{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                    CRON_SECRET_TOKEN
                  </code>
                  .
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-12 space-y-6">
        <div className="mb-6 flex items-center justify-center">
          <h2 className="ml-3 text-center text-3xl font-semibold">
            Applications Built With This Template
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border-border bg-card/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary text-xl">
                <a
                  href="https://www.threadrize.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Threadrize
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Threadrize is a comprehensive web application designed to help X (formerly Twitter)
                users create, manage, and post high-quality thread content. By leveraging AI
                technology, Threadrize enables users to transform long-form content into properly
                formatted X threads or generate entirely new threads from topic ideas. The platform
                follows a tiered subscription model to offer various levels of functionality based
                on user needs.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary text-xl">
                <a
                  href="https://toolharbor.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  ToolHarbor.io
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tool Harbor is a cloud-hosted, developer-first platform built to eliminate
                repetitive boilerplate work and accelerate feature delivery. It provides a cohesive
                suite of backend services and embeddable UI components—all accessible via a unified
                SDK—to help developers focus on core business logic and innovation. By consolidating
                critical functionalities such as secure ledger APIs, rate limiting middleware, and
                AI-powered tools, it removes the need to integrate multiple disparate vendors,
                ensuring consistency and best practices across projects. ensuring consistency and
                best practices across projects.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="mt-16 pb-10 text-center">
        <p className="text-muted-foreground">
          This is a temporary showcase. Replace this component with your actual homepage content.
        </p>
        <p className="text-muted-foreground/70 mt-2 text-sm">
          Located at:{' '}
          <code className="bg-muted rounded px-1 py-0.5">src/delete-me/delete-me.tsx</code>
        </p>
      </footer>
    </div>
  );
}
