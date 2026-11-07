# Jessi Frances website: what this is, setup, and going live

## What this is

This project holds four complete design concepts for the Jessi Frances website, so they can be compared side by side before one is chosen. They're labeled A to D, and there is a separate landing page (E) for the pre-launch waitlist:

- **The Letter.** Paper, typed letters, and envelopes, as if you were opening Frances's correspondence.
- **The Tapestry.** Dark and cinematic, with the tapestry artwork leading the whole experience.
- **The Archive.** Laid out like a museum catalogue, with numbered plates, captions, and a big index.
- **The Parlor.** Soft and warm, built for the phone first, with arched windows and a keyhole.

All four tell the same story in the same order: the tapestry, then Frances, the heirlooms, the Journal, and an invitation to join the mailing list. They also share the same products, Journal entries, and pages, so the only difference between them is the design.

The site is a React app that uses Shopify behind the scenes. Shopify handles products, stock, the cart, checkout, payments, and taxes, and the owner edits all of that in the Shopify admin. The site itself handles how everything looks.

Right now it runs on sample data, so it works without a Shopify store. Prices, Journal entries, letters, and the tapestry are all placeholders, and they're marked that way on the site.

## Running it on your computer

You'll need Node 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173. The home page lets you choose a design. Inside any design, the small bar in the bottom-left corner takes you back to the choices or switches to another design on the same page.

To check that everything builds cleanly:

```bash
npm run build
```

## Connecting Shopify

You need two things from Shopify: the store's domain and a public access token.

1. Use a Shopify plan that includes the Headless sales channel.
2. In the Shopify admin, install the **Headless** app and create a storefront.
3. In that storefront's Storefront API settings, allow it to read products, collections, inventory, blogs, and pages, and to create carts.
4. Copy the **public** access token. Never use the private token or an Admin API token here, because anything in these settings can be seen by visitors.

Create a file called `.env.local` in the project folder:

```
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your-public-token
```

Restart the dev server. The site switches from the sample data to the real store by itself.

### Setting up the store so the site can find things

The site looks for some names exactly, so these need to match:

- **The First Huggie.** Handle `the-first-huggie` and product type `Huggie`. Each size is a variant under an option called "Size".
- **Each Chapter.** Its own product, with product type `Chapter`.
- **The Chapters collection.** Handle `chapters`, holding all of the Chapters products.
- **The Journal.** A blog with the handle `journal`.
- **Pages.** Handles `the-house`, `care`, `shipping-returns`, `privacy`, and `terms`.

Publish every product and collection to the Headless sales channel. This is the easiest step to miss. If you skip it, the site connects fine but shows nothing.

Product details like materials, dimensions, care, the size guide, and what each Chapter means are product metafields. Add them under **Settings → Custom data → Products**, in the `custom` namespace, with storefront access turned on. The README lists every key name. Any you leave empty just won't show.

For preorders, turn on inventory tracking and "Continue selling when out of stock", then fill in the fulfillment note. The site shows that note next to every preorder, so it needs to be accurate.

If the real store isn't ready yet, a free development store from a Shopify Partners account is a good place to test.

## What needs to happen before going live

### Decisions from the client

- [ ] Choose one of the four designs.
- [ ] Confirm whether December 1 is the public launch date or the final prelaunch readiness date.
- [ ] Agree on the exact preorder shipping wording.
- [ ] Choose a mailing list provider (Shopify Email or Klaviyo, for example).
- [ ] Decide who owns the Shopify store, the domain, the hosting account, and the code.
- [ ] Decide whether "The Atelier" is part of launch. The brand overview mentions it, but no page has been built for it.

### Content and artwork

- [ ] Get the 2027 House Tapestry from Madi: desktop and mobile versions, plus separate layers if possible. Confirm in writing that the license covers web use, animating the layers, and keeping each year in the archive.
- [ ] Swap the tapestry into `src/shared/data/tapestry.ts`, then mark it as no longer a placeholder.
- [ ] Add real product photography, prices, sizes, materials, and care details in Shopify.
- [ ] Write the founder's story (the "The House" page in Shopify).
- [ ] Choose which of Frances's letters, if any, can be shared, and have the family review them for accuracy.
- [ ] Write the first real Journal entries, or remove the sample ones.
- [ ] Replace the symbol notes on the Tapestry page with the founder's or Madi's own words, or remove them.
- [ ] Add the real contact email and social media links. Both are in `src/shared/data/house.ts`.
- [ ] Publish real shipping, returns, privacy, and terms pages in Shopify.

### Build work

- [ ] Remove the three designs that weren't chosen, the design picker, and the switcher bar. Make the chosen design the home page at `/`.
- [ ] Remove the remaining placeholder images and the "placeholder" labels.
- [ ] Connect the email signup to the chosen provider. Right now it thanks people but doesn't save their address.
- [ ] Connect the contact form, or replace it with an email link. It doesn't send messages yet.
- [ ] Add analytics. The brief asks for analytics, and none are set up yet.
- [ ] Add a sitemap and a proper social sharing image.
- [ ] Brand the Shopify checkout to match the site under **Settings → Checkout**.

### Launch

- [ ] Deploy to Vercel, Netlify, or Cloudflare Pages, with the two Shopify settings added in the host's dashboard.
- [ ] Point the domain at the host.
- [ ] Place a real test order from start to finish, including a preorder, then refund it.
- [ ] Test on a real iPhone and a real Android phone.
- [ ] Have the owner try adding a product, a Journal entry, and a page edit on their own, using `OWNER_GUIDE.md`.

## Where to find more

- `README.md`: the technical details, including every metafield key and how the Journal maps to Shopify.
- `OWNER_GUIDE.md`: a plain-language guide for the owner on editing things in Shopify.
- `BRAND_NOTES.md`: what came from the client's documents, what's placeholder, and the full list of open questions.


## The landing page and Mailchimp

The landing page (the "Landing page" row on the home page, at `/landing-page`) is the waitlist for presales. It has one job: collect emails into Mailchimp.

1. In Mailchimp, go to **Audience > Signup forms > Embedded forms** for the audience that should hold the waitlist.
2. In the code shown there, find `action="https://....list-manage.com/subscribe/post?u=...&id=..."` and copy just that URL.
3. In the hosting dashboard (Vercel, Netlify or Cloudflare), add an environment variable named `VITE_MAILCHIMP_FORM_ACTION` with that URL, then redeploy.
4. Open `/landing-page`, sign up with a test address, and confirm it appears in the audience.

Until step 3 is done, the page shows its "thank you" message but sends nothing. If the audience uses double opt-in, people get Mailchimp's confirmation email first, which is what the thank-you message tells them to expect.

Still to confirm with the client: the Instagram and TikTok addresses (they currently open each platform's home page), and the licensed brand fonts, which are stood in for by free ones.
