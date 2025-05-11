import JsonLd from '@/components/seo/JsonLd';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd type="WebSite" />
      <JsonLd
        type="Organization"
        data={{
          name: 'saas-starter-template',
          logo: '/logo.png',
          email: 'support@saas-starter-template.com',
        }}
      />
      <h1>Hello World</h1>
    </div>
  );
}
