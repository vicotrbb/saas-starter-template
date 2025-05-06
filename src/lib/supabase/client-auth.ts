import { Database } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Client-side Supabase client
export const createSupabaseClient = () => {
  return createClientComponentClient<Database>();
};
