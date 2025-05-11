import logger from '@/lib/api/logger';
import { apiError, apiResponse } from '@/lib/api/responses';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Products } from '@/types/api.types';

/**
 * Get available products
 *
 * This endpoint returns a list of available products with their
 * associated pricing information.
 */
export async function GET() {
  try {
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select(
        `
        *,
        prices(*)
      `
      )
      .eq('active', true)
      .order('name');

    if (productsError) {
      logger.error('Error fetching products:', productsError);
      return apiError('INTERNAL_SERVER_ERROR', 'Error fetching products');
    }

    const formattedProducts: Products = products.map((product) => {
      const prices = product.prices
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

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        metadata: product.metadata,
        active: product.active,
        prices: prices,
        created_at: product.created_at,
        updated_at: product.updated_at,
        deleted_at: product.deleted_at,
      };
    });

    return apiResponse(formattedProducts);
  } catch (error) {
    logger.error('Error fetching products:', error as Error);
    return apiError('INTERNAL_SERVER_ERROR', 'Error fetching products');
  }
}
