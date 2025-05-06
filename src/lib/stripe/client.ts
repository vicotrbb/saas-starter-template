import Stripe from 'stripe';
import packageJson from '../../../package.json';
import { loadStripe, Stripe as StripeJs } from '@stripe/stripe-js';

let stripePromise: Promise<StripeJs | null>;

/**
 * Get the Stripe.js instance for client-side operations
 *
 * This function lazily initializes and returns a Stripe.js instance
 * configured with the appropriate publishable key.
 */
export const getStripeClientSideClient = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
        ''
    );
  }

  return stripePromise;
};

/**
 * Stripe client for server-side operations
 *
 * This creates a configured Stripe client using the appropriate API key
 * based on the environment. In production, it will use STRIPE_SECRET_KEY_LIVE
 * and fall back to STRIPE_SECRET_KEY in development environments.
 */
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
  {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2025-04-30.basil', // Use a specific API version for stability
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: packageJson.name,
      version: packageJson.version,
      url: packageJson.homepage,
    },
  }
);
