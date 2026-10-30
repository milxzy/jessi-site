import { STOREFRONT_API_VERSION, shopifyConfig } from '../config'

// a plain fetch client for the storefront graphql api. kept tiny on purpose: no sdk in the bundle.

export class StorefrontError extends Error {}

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${shopifyConfig.domain}/api/${STOREFRONT_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': shopifyConfig.token,
    },
    body: JSON.stringify({ query, variables }),
  }).catch(() => {
    // fetch only rejects when the network or the domain is unreachable
    throw new StorefrontError('We couldn’t reach the store. Check your connection and try again.')
  })
  if (!res.ok) throw new StorefrontError(`The store didn’t respond (${res.status}). Try again in a moment.`)
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] }
  if (json.errors?.length) throw new StorefrontError(json.errors.map((e) => e.message).join('; '))
  if (!json.data) throw new StorefrontError('The store sent an empty response.')
  return json.data
}

// mutations report problems as userErrors rather than graphql errors
export function assertNoUserErrors(errors: { message: string }[] | undefined) {
  if (errors?.length) throw new StorefrontError(errors.map((e) => e.message).join(' '))
}
