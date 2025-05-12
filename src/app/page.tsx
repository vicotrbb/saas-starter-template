import JsonLd from '@/components/seo/JsonLd';
import { DeleteMeHomepage } from '@/delete-me/delete-me';

export default function Home() {
  return (
    <>
      <JsonLd type="WebSite" />
      <JsonLd
        type="Organization"
        data={{
          name: 'saas-starter-template',
          logo: '/logo.png',
          email: 'support@saas-starter-template.com',
        }}
      />
      <DeleteMeHomepage />
    </>
  );
}
