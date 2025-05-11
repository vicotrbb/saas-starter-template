import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/api/logger';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { apiError, apiResponse } from '@/lib/api/responses';
import { handleStripeWebhook } from '@/lib/features/stripe';

/**
 * Stripe webhook handler
 *
 * This endpoint receives webhook events from Stripe and processes them appropriately.
 * Events include subscription updates, payment successes/failures, and product/price changes.
 *
 * Important: This route must be excluded from CSRF protection in middleware.
 */
export async function POST(req: NextRequest) {
  try {
    logger.info('Stripe webhook received');
    const signature = req.headers.get('stripe-signature');
    const payload = await req.text();

    if (!signature) {
      logger.error('Missing stripe-signature header');
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      if (!signature) {
        throw new Error('Missing Stripe webhook secret.');
      }

      event = stripe.webhooks.constructEvent(payload, signature, signature);
      logger.info('Stripe webhook event:', { event });
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(`Webhook signature verification failed: ${err.message}`);
        return apiError('BAD_REQUEST', err.message);
      } else {
        logger.error(`Webhook signature verification failed: ${err}`);
        return apiError('INTERNAL_SERVER_ERROR', `Webhook Signature Verification Error: ${err}`);
      }
    }

    await handleStripeWebhook(event);

    logger.info('Stripe webhook processed successfully');
    return apiResponse({ received: true, message: 'Stripe webhook processed successfully' });
  } catch (error) {
    logger.error('Error handling Stripe webhook:', error as Error);
    return apiError('INTERNAL_SERVER_ERROR', 'Internal server error');
  }
}
