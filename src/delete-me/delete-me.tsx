import { Badge } from '@/components/ui/badge';
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
                  className="border-border bg-card/70 hover:shadow-primary/30 flex flex-col shadow-sm transition-shadow duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center text-xl">
                      {feature.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col justify-between">
                    <div className="mt-auto">
                      {feature.tags && feature.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-3">
                          {feature.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>

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
