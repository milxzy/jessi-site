import { isShopifyConfigured } from './config'
import { mockAdapter } from './mockAdapter'
import { shopifyAdapter } from './shopify/adapter'
import type { CommerceAdapter } from './types'

// shopify when both env vars are set, otherwise the mock store, so the presentation always runs
export const commerce: CommerceAdapter = isShopifyConfigured ? shopifyAdapter : mockAdapter
