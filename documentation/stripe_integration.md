# Stripe Integration Documentation

## Overview

This document outlines the integration between this application and Stripe for handling subscriptions and payments. The integration is designed to support both user-level and organization-level billing, with comprehensive tracking of products, prices, subscriptions, and payments.

## Database Structure

### Products Table

```sql
create table products (
    id uuid primary key default gen_random_uuid(),
    stripe_product_id text not null unique,
    name text not null,
    description text,
    active boolean not null default true,
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now()),
    deleted_at timestamp with time zone
);
```

- Mirrors Stripe's Products
- `stripe_product_id`: Links to Stripe's product
- `metadata`: Stores additional Stripe data
- `active`: Manages product lifecycle

### Prices Table

```sql
create table prices (
    id uuid primary key default gen_random_uuid(),
    stripe_price_id text not null unique,
    product_id uuid not null references products(id),
    currency text not null,
    unit_amount bigint not null, -- amount in cents
    recurring_interval recurring_interval, -- 'month' or 'year', null for one-time
    active boolean not null default true,
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now()),
    deleted_at timestamp with time zone
);
```

- Mirrors Stripe's Prices
- Supports both recurring and one-time prices
- `unit_amount`: Stored in cents (e.g., 1000 = $10.00)

### Stripe Customers Table

```sql
create table stripe_customers (
    id uuid primary key default gen_random_uuid(),
    stripe_customer_id text not null unique,
    user_id uuid references auth.users(id),
    organization_id uuid references organizations(id),
    created_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now())
);
```

- Maps users/organizations to Stripe customers
- Enforces one-to-one relationship (either user_id or organization_id must be set)

### Subscriptions Table

```sql
create table subscriptions (
    id uuid primary key default gen_random_uuid(),
    stripe_subscription_id text not null unique,
    stripe_customer_id uuid not null references stripe_customers(id),
    price_id uuid not null references prices(id),
    status subscription_status not null,
    current_period_start timestamp with time zone not null,
    current_period_end timestamp with time zone not null,
    cancel_at_period_end boolean not null default false,
    created_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now()),
    deleted_at timestamp with time zone
);
```

- Tracks subscription state
- `status`: Uses enum for type safety
- `cancel_at_period_end`: Handles subscription cancellation

### Payments Table

```sql
create table payments (
    id uuid primary key default gen_random_uuid(),
    stripe_payment_intent_id text not null unique,
    stripe_customer_id uuid not null references stripe_customers(id),
    amount bigint not null, -- amount in cents
    currency text not null,
    status payment_status not null,
    payment_type payment_type not null,
    subscription_id uuid references subscriptions(id),
    price_id uuid references prices(id),
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now())
);
```

- Tracks both subscription and one-time payments
- `payment_type`: 'subscription' or 'one_time'
- `metadata`: Stores additional payment data

## Security & Access Control

### Row Level Security (RLS)

1. **Products & Prices**
   - Anyone can view active products/prices
   - Only system admins can manage (create/update/delete)

2. **Stripe Customers**
   - Users can view their own customer record
   - Organization admins can update their org's customer records
   - System admins have full access

3. **Subscriptions**
   - Users can view their own subscriptions
   - Organization admins can update their org's subscriptions
   - System admins have full access

4. **Payments**
   - Users can view their own payments
   - Organization admins can update their org's payments
   - System admins have full access

## Integration Workflows

### 1. Product & Price Management

```typescript
// Sync products from Stripe
async function syncProducts() {
  const products = await stripe.products.list();
  for (const product of products.data) {
    await db.products.upsert({
      stripe_product_id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      metadata: product.metadata
    });
  }
}

// Sync prices from Stripe
async function syncPrices() {
  const prices = await stripe.prices.list();
  for (const price of prices.data) {
    await db.prices.upsert({
      stripe_price_id: price.id,
      product_id: price.product,
      currency: price.currency,
      unit_amount: price.unit_amount,
      recurring_interval: price.recurring?.interval,
      active: price.active,
      metadata: price.metadata
    });
  }
}
```

### 2. Customer Management

```typescript
// Create or get Stripe customer
async function getOrCreateStripeCustomer(userId: string) {
  // Check if customer exists
  const existing = await db.stripe_customers
    .select()
    .eq('user_id', userId)
    .single();

  if (existing) return existing;

  // Create new customer in Stripe
  const customer = await stripe.customers.create({
    metadata: { userId }
  });

  // Store in database
  return await db.stripe_customers.insert({
    stripe_customer_id: customer.id,
    user_id: userId
  });
}
```

### 3. Subscription Management

```typescript
// Create subscription
async function createSubscription(customerId: string, priceId: string) {
  // Create in Stripe
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  });

  // Store in database
  return await db.subscriptions.insert({
    stripe_subscription_id: subscription.id,
    stripe_customer_id: customerId,
    price_id: priceId,
    status: subscription.status,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
  });
}

// Cancel subscription
async function cancelSubscription(subscriptionId: string) {
  const subscription = await db.subscriptions
    .select()
    .eq('id', subscriptionId)
    .single();

  // Cancel in Stripe
  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: true
  });

  // Update in database
  await db.subscriptions
    .update({ cancel_at_period_end: true })
    .eq('id', subscriptionId);
}
```

### 4. Payment Processing

```typescript
// Create payment intent
async function createPaymentIntent(customerId: string, amount: number) {
  // Create in Stripe
  const intent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: customerId,
  });

  // Store in database
  return await db.payments.insert({
    stripe_payment_intent_id: intent.id,
    stripe_customer_id: customerId,
    amount,
    currency: 'usd',
    status: intent.status,
    payment_type: 'one_time',
  });
}

// Handle successful payment
async function handleSuccessfulPayment(paymentIntentId: string) {
  const payment = await db.payments
    .select()
    .eq('stripe_payment_intent_id', paymentIntentId)
    .single();

  await db.payments
    .update({ status: 'succeeded' })
    .eq('id', payment.id);
}
```

## Webhook Handling

### Required Webhooks

1. **Product Events**
   - `product.created`
   - `product.updated`
   - `product.deleted`

2. **Price Events**
   - `price.created`
   - `price.updated`
   - `price.deleted`

3. **Subscription Events**
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`

4. **Payment Events**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
   - `charge.failed`

### Webhook Handler Example

```typescript
app.post('/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  try {
    switch (event.type) {
      case 'product.created':
      case 'product.updated':
        await syncProduct(event.data.object);
        break;

      case 'price.created':
      case 'price.updated':
        await syncPrice(event.data.object);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await syncSubscription(event.data.object);
        break;

      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
        await syncPayment(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

## Best Practices

1. **Error Handling**
   - Implement retries for failed operations
   - Log all Stripe API errors
   - Handle webhook failures gracefully

2. **Data Consistency**
   - Use transactions for related operations
   - Keep Stripe and database in sync via webhooks
   - Implement idempotency keys for critical operations

3. **Security**
   - Never expose Stripe API keys
   - Validate webhook signatures
   - Use RLS policies for access control
   - Protect critical fields from modification

4. **Monitoring**
   - Track failed payments
   - Monitor subscription status changes
   - Set up alerts for critical events

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Security](https://stripe.com/docs/security)
