export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone_number: string | null;
          role: 'user' | 'org-admin' | 'system-admin';
          organization_id: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone_number?: string | null;
          role: 'user' | 'org-admin' | 'system-admin';
          organization_id: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone_number?: string | null;
          role?: 'user' | 'org-admin' | 'system-admin';
          organization_id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      rate_limits: {
        Row: {
          id: string;
          user_id: string | null;
          organization_id: string | null;
          type: 'api' | 'auth';
          key: string;
          counter: number;
          max_requests: number;
          expires_at: string;
          created_at: string;
          last_updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          organization_id?: string | null;
          type: 'api' | 'auth';
          key: string;
          counter?: number;
          max_requests: number;
          expires_at: string;
          created_at?: string;
          last_updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          organization_id?: string | null;
          type?: 'api' | 'auth';
          key?: string;
          counter?: number;
          max_requests?: number;
          expires_at?: string;
          created_at?: string;
          last_updated_at?: string;
        };
      };
      prices: {
        Row: {
          id: string;
          stripe_price_id: string;
          product_id: string;
          currency: string;
          unit_amount: number;
          recurring_interval: 'month' | 'year' | null;
          active: boolean;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          stripe_price_id: string;
          product_id: string;
          currency: string;
          unit_amount: number;
          recurring_interval?: 'month' | 'year' | null;
          active?: boolean;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          stripe_price_id?: string;
          product_id?: string;
          currency?: string;
          unit_amount?: number;
          recurring_interval?: 'month' | 'year' | null;
          active?: boolean;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          stripe_payment_intent_id: string;
          stripe_customer_id: string;
          amount: number;
          currency: string;
          status:
            | 'succeeded'
            | 'processing'
            | 'requires_payment_method'
            | 'requires_confirmation'
            | 'requires_action'
            | 'requires_capture'
            | 'canceled'
            | 'failed';
          payment_type: 'subscription' | 'one_time';
          subscription_id: string | null;
          price_id: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          stripe_payment_intent_id: string;
          stripe_customer_id: string;
          amount: number;
          currency: string;
          status:
            | 'succeeded'
            | 'processing'
            | 'requires_payment_method'
            | 'requires_confirmation'
            | 'requires_action'
            | 'requires_capture'
            | 'canceled'
            | 'failed';
          payment_type: 'subscription' | 'one_time';
          subscription_id?: string | null;
          price_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          stripe_payment_intent_id?: string;
          stripe_customer_id?: string;
          amount?: number;
          currency?: string;
          status?:
            | 'succeeded'
            | 'processing'
            | 'requires_payment_method'
            | 'requires_confirmation'
            | 'requires_action'
            | 'requires_capture'
            | 'canceled'
            | 'failed';
          payment_type?: 'subscription' | 'one_time';
          subscription_id?: string | null;
          price_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_rate_limit: {
        Args: {
          scope_type: string;
          scope_id: string;
          type_param: 'api' | 'auth';
          key_param: string;
          ttl_param: number;
          max_param: number;
        };
        Returns: number;
      };
      cleanup_expired_rate_limits: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
    Enums: {
      user_role: 'user' | 'org-admin' | 'system-admin';
      subscription_status:
        | 'trialing'
        | 'active'
        | 'canceled'
        | 'incomplete'
        | 'incomplete_expired'
        | 'past_due'
        | 'unpaid';
      payment_status:
        | 'succeeded'
        | 'processing'
        | 'requires_payment_method'
        | 'requires_confirmation'
        | 'requires_action'
        | 'requires_capture'
        | 'canceled'
        | 'failed';
      recurring_interval: 'month' | 'year';
      payment_type: 'subscription' | 'one_time';
      rate_limit_type: 'api' | 'auth';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
