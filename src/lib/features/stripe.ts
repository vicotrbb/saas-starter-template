import { stripe } from '../stripe/client';
import { supabaseAdmin } from '../supabase/admin';
import { Stripe } from 'stripe';
import logger from '@/lib/api/logger';

/**
 * Create a Stripe customer for a user
 * @param userId - The ID of the user to create the Stripe customer for
 * @returns The Stripe customer object and the database record
 */
export const createStripeCustomerOutOfUserId = async (userId: string) => {
  const { data: user, error: userFetchError } = await supabaseAdmin
    .from('users')
    .select('id, email, first_name, last_name')
    .eq('id', userId)
    .single();

  if (userFetchError) {
    throw new Error(userFetchError.message);
  }

  if (!user) {
    throw new Error('User not found');
  }

  const stripeCustomer = await stripe.customers.create({
    email: user.email,
    name: `${user.first_name} ${user.last_name}`,
    metadata: { userId },
  });

  const { data, error } = await supabaseAdmin.from('stripe_customers').insert({
    id: stripeCustomer.id,
    user_id: userId,
    stripe_customer_id: stripeCustomer.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    fromStripe: stripeCustomer,
    fromDatabase: data,
  };
};

/**
 * Create a Stripe customer for an organization
 * @param organizationId - The ID of the organization to create the Stripe customer for
 * @returns The Stripe customer object and the database record
 */
export const createStripeCustomerOutOfOrganizationId = async (organizationId: string) => {
  const { data: organization, error: organizationFetchError } = await supabaseAdmin
    .from('organizations')
    .select(
      `
      id, 
      name,
      users!inner (
        email
      )
    `
    )
    .eq('id', organizationId)
    .eq('users.role', 'org-admin')
    .limit(1)
    .single();

  if (organizationFetchError) {
    throw new Error(organizationFetchError.message);
  }

  if (!organization) {
    throw new Error('Organization not found');
  }

  if (organization.users.length === 0) {
    throw new Error('Organization has no admin users');
  }

  const stripeCustomer = await stripe.customers.create({
    name: organization.name,
    email: organization.users[0].email,
    metadata: { organizationId },
  });

  const { data, error } = await supabaseAdmin.from('stripe_customers').insert({
    id: stripeCustomer.id,
    organization_id: organizationId,
    stripe_customer_id: stripeCustomer.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    fromStripe: stripeCustomer,
    fromDatabase: data,
  };
};

/**
 * Handle Stripe webhook events
 * @param event - The Stripe event to handle
 */
export const handleStripeWebhook = async (event: Stripe.Event) => {
  logger.info('Processing Stripe webhook event:', { type: event.type });

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      default:
        logger.info('Unhandled event type:', { type: event.type });
    }
  } catch (error) {
    logger.error('Error handling Stripe webhook:', error);
    throw error;
  }
};

/**
 * Handle subscription changes (created, updated, deleted)
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const { data: customer, error: customerError } = await supabaseAdmin
    .from('stripe_customers')
    .select('id, user_id, organization_id')
    .eq('stripe_customer_id', subscription.customer.toString())
    .single();

  if (customerError) {
    throw new Error(`Error fetching customer: ${customerError.message}`);
  }

  if (!customer) {
    throw new Error(`No customer found for Stripe customer ID: ${subscription.customer}`);
  }

  const { data: price, error: priceError } = await supabaseAdmin
    .from('prices')
    .select('id')
    .eq('stripe_price_id', subscription.items.data[0].price.id)
    .single();

  if (priceError) {
    throw new Error(`Error fetching price: ${priceError.message}`);
  }

  if (!price) {
    throw new Error(`No price found for Stripe price ID: ${subscription.items.data[0].price.id}`);
  }

  // Handle subscription deletion
  if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    const { error: deleteError } = await supabaseAdmin
      .from('subscriptions')
      .update({ deleted_at: new Date().toISOString() })
      .eq('stripe_subscription_id', subscription.id);

    if (deleteError) {
      throw new Error(`Error deleting subscription: ${deleteError.message}`);
    }

    return;
  }

  // Upsert subscription
  const { data: subscriptionData, error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customer.id,
      price_id: price.id,
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
      deleted_at: null,
    });

  if (upsertError) {
    throw new Error(`Error upserting subscription: ${upsertError.message}`);
  }

  return subscriptionData;
}
