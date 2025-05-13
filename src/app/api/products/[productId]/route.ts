import logger from '@/lib/api/logger';
import { apiError, apiResponse } from '@/lib/api/responses';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Prices } from '@/types/api.types';
import { NextRequest } from 'next/server';

/**
 * Get available prices for a product
 *
 * This endpoint returns a list of available prices for a product.
 */
export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId');

    if (!productId) {
      return apiError('BAD_REQUEST', 'Product ID is required');
    }

    const { data: prices, error: pricesError } = await supabaseAdmin
      .from('prices')
      .select(`*`)
      .eq('product_id', productId)
      .order('name');

    if (pricesError) {
      logger.error('Error fetching prices:', pricesError);
      return apiError('INTERNAL_SERVER_ERROR', 'Error fetching prices');
    }

    const formattedPrices: Prices = prices
      .filter((price) => price.active)
      .sort((a, b) => a.unit_amount - b.unit_amount)
      .map((price) => ({
        id: price.id,
        currency: price.currency,
        unit_amount: price.unit_amount,
        recurring_interval: price.recurring_interval,
        active: price.active,
        metadata: price.metadata,
        created_at: price.created_at,
        updated_at: price.updated_at,
        deleted_at: price.deleted_at,
      }));

    return apiResponse(formattedPrices);
  } catch (error) {
    logger.error('Error fetching prices:', error as Error);
    return apiError('INTERNAL_SERVER_ERROR', 'Error fetching prices');
  }
}
