import { generateMetadata } from '@/app/metadata';
import Register from '@/components/auth/Register';

export const metadata = generateMetadata({
  title: 'Create Your Account',
  description: '',
  path: '/auth/register',
});

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Register />
    </div>
  );
}
