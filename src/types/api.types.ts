import { Enums, Tables } from './database.types';

export type Payment = Tables<'payments'>;
export type Payments = Array<Payment>;

export type Subscription = Tables<'subscriptions'>;
export type Subscriptions = Array<Subscription>;

export type Price = Omit<Tables<'prices'>, 'product_id' | 'stripe_price_id'>;
export type Prices = Array<Price>;

export type Product = Omit<Tables<'products'>, 'prices' | 'stripe_product_id'> & {
  prices?: Prices;
};
export type Products = Array<Product>;

export type Organization = Tables<'organizations'>;
export type Organizations = Array<Organization>;

export type User = Tables<'users'>;
export type Users = Array<User>;

export type UserRole = Enums<'user_role'>;
export type SubscriptionStatus = Enums<'subscription_status'>;
export type PaymentStatus = Enums<'payment_status'>;
export type RecurringInterval = Enums<'recurring_interval'>;
export type PaymentType = Enums<'payment_type'>;
export type RateLimitType = Enums<'rate_limit_type'>;
