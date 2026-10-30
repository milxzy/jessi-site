# Jessi Frances: four website concepts

One project holding four complete design concepts for the digital home of Jessi Frances, The House of Becoming. They let the client click through each one and compare them. All four share the same data, commerce, and content layers. Each has its own layout, components, typography, and motion.

| Route | Concept | Idea |
| --- | --- | --- |
| `/` | Concept picker | Live thumbnails of all four |
| `/a/*` | Design A, The Letter | Paper sheets on a parchment desk, typed letters, envelopes as doorways |
| `/b/*` | Design B, The Tapestry | Dark and cinematic, full-bleed layered tapestry, numbered doorways that crossfade tapestry details |
| `/c/*` | Design C, The Archive | Catalogue plates and captions, a giant index with a cursor-following image, the Tapestry page as the archive |
| `/d/*` | Design D, The Parlor | Phone-first, a keyhole window, arched panels that open like an accordion, bottom sheets |

Inside any concept, the small bar at the bottom left goes back to the picker. It also switches concepts while keeping the current page, so `/a/journal` becomes `/b/journal`.

Client source material, what is placeholder, and open questions are in [`BRAND_NOTES.md`](BRAND_NOTES.md). The owner's plain-language guide is [`OWNER_GUIDE.md`](OWNER_GUIDE.md).

## Run, build, deploy

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck, then a static build in dist/
npm run preview    # serve dist/ locally
```

Node 20 or later. The build is a static single-page app:

- **Vercel**: import the repo. `vercel.json` already rewrites every path to `index.html`.
- **Netlify** or **Cloudflare Pages**: build command `npm run build`, output `dist`. `public/_redirects` handles client-side routes.

Set the environment variables below in the host's dashboard, not in the repo.

## Environment

Copy `.env.example` to `.env.local`.

| Variable | Purpose |
| --- | --- |
| `VITE_SHOPIFY_STORE_DOMAIN` | e.g. `jessi-frances.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | The **public** Storefront API token from the Headless sales channel |
| `VITE_SHOPIFY_JOURNAL_BLOG` | Blog handle for the Journal (default `journal`) |

With both of the first two set, the site uses Shopify. With either missing, it runs on the built-in mock store, so the design presentation always works offline.

Only the public Storefront token belongs here. It's designed to be visible in the browser. **Never** put an Admin API token in a `VITE_` variable, because anything prefixed `VITE_` is shipped to every visitor.

## Architecture

Stack: Vite, React 18, TypeScript (strict), Tailwind CSS 4, React Router 6.

```
src/
  app/               router, concept picker, the presentation switcher bar
  shared/
    data/            the single source of placeholder content: catalog, journal, pages, house copy, images, tapestry
    commerce/        the commerce adapter interface, mock and shopify adapters, cart context
      shopify/       storefront api client, queries, and the one mapping file
    content/         journal and pages access (shopify or mock), html sanitizing, section splitting
    lib/             hooks (async data, purchase, signup/contact forms, dialogs, motion, seo) and a bare <Picture>
  concepts/
    a/ b/ c/ d/      each: tokens.css, ui.tsx, Layout, Home, House, Shop, Journal, TapestryPage, Service, NotFound
public/
  placeholders/      tapestry layers, product drawings, public-domain photographs (with credits.json)
scripts/             generators for the placeholder tapestry and product drawings
```

Rules the code follows:

- **Concepts share data, never visuals.** Shared code is limited to data, logic, and hooks with no markup. The one exception is `<Picture>`, which is a bare `<img>` with no styling. Each concept draws its own header, bag drawer, forms, loading, error, and empty states.
- **Tokens, not hex values.** Tailwind's palette is cleared. Utilities like `bg-ground` and `text-accent` resolve to CSS variables that each concept sets on its root class (`.ca`, `.cb`, `.cc`, `.cd`).
- **Concept CSS lives in `@layer components`**, so Tailwind utilities on the same element still win.
- **Each concept is its own lazy chunk**, so its fonts and CSS load only when it's visited. Fonts are self-hosted through Fontsource.

### Fonts per concept

| | Display | Text | Letters and Journal only |
| --- | --- | --- | --- |
| A | Newsreader (optical sizes) | Hanken Grotesk | Courier Prime |
| B | Bodoni Moda (optical sizes) | Manrope | Special Elite |
| C | Instrument Serif | Schibsted Grotesk | IBM Plex Mono |
| D | EB Garamond | Figtree | Cutive Mono |
| Picker | Fraunces | | |

## Commerce: headless Shopify

The UI talks only to `CommerceAdapter` (`src/shared/commerce/types.ts`): `listProducts`, `getProduct`, `getCollections`, `getCollectionProducts`, `createCart`, `getCart`, `addToCart`, `updateCartLine`, `removeFromCart`, `getCheckoutUrl`, and `subscribeEmail`. No component imports Shopify code.

- `shopifyAdapter` uses the **Storefront API (GraphQL)** with plain `fetch` and the Cart API (`cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`). The cart id is kept in `localStorage`, and an expired cart is forgotten and recreated.
- **API version:** `STOREFRONT_API_VERSION = '2026-10'` in `src/shared/commerce/config.ts`. It was checked against shopify.dev's versioning page on October 28, 2026, and it's the only place the version appears. Shopify releases a version every quarter and supports each for at least a year.
- All Shopify shapes become app types in **one file**, `src/shared/commerce/shopify/mapping.ts`.
- **Checkout** is Shopify's own: the bag's button sends the visitor to the cart's `checkoutUrl`. No payments are built here. In mock mode it opens a stub page that says so. Shopify checkout can be branded to match the chosen design in the Shopify admin (Settings, Checkout).
- **Prices** come from Shopify money fields and are formatted with `Intl.NumberFormat` using the returned currency code.

### Products, variants, and availability

- The First Huggie's sizes are **variants** with an option named `Size`.
- **Sold out** means Shopify won't sell the variant (`availableForSale: false`).
- **Preorder** means Shopify sells it while out of stock (`currentlyNotInStock: true`, with "continue selling when out of stock" enabled). The `custom.preorder` metafield can also force preorder.
- Preorder messaging always shows the product's `custom.fulfillment_note`. **Don't enable preorders without filling it in**, because the brief requires accurate fulfillment expectations.
- Chapters are separate products of type `Chapter`, in a collection with handle `chapters`. The Huggie has type `Huggie`.

### Metafields (namespace `custom`)

Create these as product metafield definitions in Settings, Custom data, Products. Turn on **Storefront access** for each. Every one is optional, and pages simply leave out what's missing.

| Key | Type | Used for |
| --- | --- | --- |
| `materials` | multi-line text | Materials |
| `dimensions` | multi-line text | Dimensions |
| `care` | multi-line text | Care |
| `size_guide` | multi-line text | Fit and size guide (Huggie) |
| `chapters_compatibility` | multi-line text | Compatibility between the Huggie and Chapters |
| `chapter_meaning` | multi-line text | The meaning of a chapter |
| `fulfillment_note` | single-line text | Preorder shipping expectation, shown on product pages and in the bag |
| `preorder` | true/false | Forces preorder labelling |
| `short_title` | single-line text | Shorter name in lists (e.g. "The Becoming") |

### Email signup

`subscribeEmail()` currently validates the address and thanks the visitor, but **doesn't send the address anywhere**, in both mock and Shopify mode. Choosing the provider is an open question. Options:

1. **Shopify customer marketing.** The Storefront API's `customerCreate` with `acceptsMarketing: true` needs a password, so in practice you'd use a small serverless function that calls the Admin API (where the token stays on the server). Pair it with **Shopify Email** for sending.
2. **Klaviyo** (or a similar tool) with its public client subscribe endpoint. This is simple and keeps lists outside Shopify.
3. **Shopify Forms** app, embedded or proxied.

Whichever is chosen goes in `subscribeEmail()` in `src/shared/commerce/shopify/adapter.ts`, and nothing else changes. The Care page's contact form is also a placeholder with no backend. Shopify Inbox, a form service, or the same serverless function would work.

## Owner-editable content

### The Frances Journal → Shopify blog

The Journal reads the blog with handle `journal` (or `VITE_SHOPIFY_JOURNAL_BLOG`) through the Storefront API, newest first. Article fields map like this:

| Shopify article | Journal |
| --- | --- |
| Title | Entry title |
| Excerpt | Teaser and the article's standfirst |
| Content | Body, sanitized with DOMPurify before rendering |
| Image | Cover image |
| Tags | The first tag is shown as the category |
| Published date | Date |
| Handle | URL, `/x/journal/<handle>` |

Inside an article body, the founder can use:

- **Pull quote:** the editor's quote block (`<blockquote>`).
- **Typed letter:** a block with class `letter`, styled as a typewritten sheet in every concept. In the Shopify editor, switch to HTML (`<>`) and wrap the text: `<div class="letter"><p>…</p></div>`.
- **Captioned image:** `<figure><img …><figcaption>…</figcaption></figure>`.

If the blog is missing, the placeholder entries in `src/shared/data/journal.ts` are shown.

### Pages → Shopify Online Store, Pages

| Handle | Used for |
| --- | --- |
| `the-house` | The founder's story on The House page |
| `care` | Care & Service. Each **Heading 2** becomes a section; inside a section titled "Questions", each **Heading 3** becomes one FAQ |
| `shipping-returns`, `privacy`, `terms` | Legal pages |

The rest of The House page (philosophy, values, North Star) is quoted from the brand overview in `src/shared/data/house.ts`. It could move to a Shopify metaobject later if the owner wants to edit it.

### The House Tapestry

Today the tapestry is configured in `src/shared/data/tapestry.ts`:

- `tapestryConfig` is the current year: `desktopSrc`, `mobileSrc`, optional `layers[]` (each with desktop and mobile files and a scroll `depth`), `credit`, `alt`, `year`, `roman`, `isPlaceholder`, and `motifs[]`.
- `tapestryArchive` lists every published year. `tapestryYears` lays out MMXXVII to MMXXXVI.

**Swapping in Madi's artwork** means changing only that file. Drop her exports into `public/resources/tapestry/`, point `desktopSrc` and `mobileSrc` (and `layers`, if she supplies separate layers) at them, then update `credit` and `alt` and set `isPlaceholder: false`. If there are no layers, delete `layers`, and every concept falls back to the single image. The motif marker positions in C's and D's Tapestry pages follow the placeholder's geometry and must be re-placed for the real art (they're commented in each file).

**Later, without code changes:** create a Shopify metaobject definition `house_tapestry` with fields `year` (integer), `roman` (text), `title`, `desktop_image` and `mobile_image` (files), `layers` (list of files), `credit`, `alt`, and `motifs` (JSON). Fetch it with the Storefront API's `metaobjects(type: "house_tapestry")`, and map it into `TapestryChapter` in a new `shared/content/tapestry.ts`. The newest entry becomes `tapestryConfig`, and all entries become the archive. Each year is then a new entry in the admin.

### Images

Every placeholder image is listed once, in `src/shared/data/images.ts`. Photographs are public-domain works from the Art Institute of Chicago (CC0), credited in `public/placeholders/photos/credits.json`. None of them shows a Jessi Frances piece. Product images are drawn placeholders (`npm run tapestry`, `node scripts/build-products.mjs`). In Shopify mode, product, article, and collection images come from Shopify's CDN at the right width.

## Quality notes

- Responsive from 375 to 1728 px. Every route in every concept was screenshotted at 375 and 1728 px in headless Chrome.
- Skip link, landmarks, visible concept-styled focus rings, keyboard-operable menus, drawers (focus trap, Escape, focus return), doorways (hover reveals also on focus and tap), tabs (arrow keys in B), and accordions.
- WCAG AA contrast checked for every text pair in all four palettes.
- `prefers-reduced-motion` turns off the layer reveal, scroll-linked drift, and cursor follow. Motion uses `transform` and `opacity`, 300 to 1200 ms.
- Per-page titles, descriptions, and Open Graph tags. JSON-LD for products and articles. Per-concept `theme-color`.

## Option B tradeoff (from the brief)

This is option B from the brief: a custom React storefront on Shopify. The owner edits products, prices, stock, images, Journal entries, and pages in the **Shopify admin**, and the site picks the changes up. What the owner can't change without a developer is layout and design, which lives in this code rather than in a Shopify theme editor. Option A (a customized Shopify theme) would give theme-editor control but less freedom in the design. Monthly costs: a Shopify plan that includes the Headless channel, plus hosting (Vercel, Netlify, and Cloudflare all have free tiers suited to a site this size).
