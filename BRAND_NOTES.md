# Brand notes: Jessi Frances, The House of Becoming

Written before design began. Sources, in order of authority:

1. **Brand Overview, Creative Partner Edition, October 2026** (PDF, 5 pages)
2. **Website Creative & Development Brief, for Miles, October 2026** (PDF, 3 pages)
3. **Creative Direction notes** (phone note, two screenshots)
4. The developer's build plan (v2). Where it disagrees with 1 to 3, the client documents win. Disagreements are listed below.

---

## What the client documents say

### The house
- An emerging American luxury jewelry house "rooted in family, memory, femininity, craftsmanship, and the belief that every woman's story deserves to be honored."
- Ambition: "a lasting maison", one day including fine jewelry, leather goods, handbags, and heirloom objects. It begins with jewelry.
- Aspiration: "the artistic world-building of a heritage fashion house, with the product integrity and service standards expected of the finest jewelers... without imitating another house's visual identity."
- Approved lines (verbatim):
  - "For the woman you are. And the woman you're becoming." (signature line)
  - "She doesn't wear jewelry to be noticed. She wears it to remember who she's becoming."
  - "You are already someone worth celebrating. And you are still becoming."
  - "A journal of women becoming."
  - "Wear the chapter you're in."
  - The North Star: "She is the woman she once dreamed of becoming. She deserves to celebrate how far she's come, to love who she is today, and to look forward to all that is still unfolding. Not because she isn't enough. But because her story isn't finished."

### Frances
- The house is named for Frances, the founder's grandmother. "Her life, love, perseverance, and typewritten words form the emotional origin of Jessi Frances."
- After Frances passed, her granddaughter discovered letters that revealed new dimensions of her strength and hope. "Women carry stories worth preserving, and beauty can be a way of remembering."
- "Frances is not a fictional muse or a decorative marketing device. Her real history should be treated with warmth, dignity, accuracy, and restraint."
- **We have no biographical details, dates, photographs, or letter text.** None are invented on the site.

### The philosophy of becoming
- "Celebrate how far she's come. Love the woman she is. And remind her that she's still becoming."
- "Becoming is not about being unfinished or insufficient."

### What the house must always feel like (verbatim headings)
Personal, not performative. Artistic, not ornamental. Refined, not cold. Timeless, not trend-driven. Celebratory, not corrective.

### Creative direction notes (verbatim, from the phone note)
- "We are not creating a traditional jewelry e-commerce website. We are creating the digital home of a house that begins with jewelry but will eventually expand into other heirloom objects and categories."
- "The website should feel cinematic, intimate, artistic, timeless, and quietly luxurious."
- "Commerce should be intuitive and beautifully integrated, but it should not dominate the experience."
- "Our goal is to create a destination women want to return to, not only because they want to purchase something, but because the House makes them feel seen, celebrated, and inspired."

### Visual language
- Palette: warm ivory, parchment, espresso, charcoal, restrained (muted) antique gold, rich textures. Opal used selectively.
- Typography: elegant heritage editorial serif with a clean complementary text face. Typewriter treatment is reserved for letters and the Journal.
- Motifs: magnolia bud and bloom, roots, branches, vines, trees, the open C of becoming, moon and sun, keyholes, laurel, MMXXVII, "and select flowers or places meaningful to the family". "Symbolism should feel discovered, not over-explained." "Never cluttered or overly floral."
- Imagery: fine jewelry macro, human storytelling, paper textures, archival letters, original botanical illustration.
- Guardrail: Dior is an ambition for art direction only. No copying Dior patterns, trademarks, layouts, or distinctive designs.

### The House Tapestry
- An annual illustrated chapter of the maison. The first is the **2027 House Tapestry (MMXXVII)**, preview **November 8, 2026**, ahead of the January 2027 collection.
- "The connected ten-year masterwork is envisioned for MMXXVII–MMXXXVI."
- It welcomes visitors at the very beginning, and its visual language leads into Frances, the jewelry, and the Journal. Each year's artwork is preserved in a permanent archive.
- Illustrator: Madi. Coordinate high-res exports, web crops, mobile versions, licensing, and separate layers for restrained motion if the licence allows. Confirm digital usage and animation rights in writing.

### The objects (names used exactly as written)
- **The First Huggie™**: foundational, carefully fitted, beautiful on its own, multiple sizes, unobtrusive connection for removable drops.
- **Chapters™**: interchangeable heirloom drops that "honor a woman's past, celebrate her present, and welcome what comes next." Early symbolism: The Beginning, The Becoming, The Mother.
- **The Becoming Bangle**: future signature two-tone object. Not for sale.
- **The First Promise™** and the **Growing Service™**: longer-term concepts. Not for sale, not built.
- Opal: "a selective house signature, sometimes seen, sometimes hidden."

### Experience and commerce
- Mobile-first, fast, accessible, easy to shop. "The customer should never have to work to find a product, understand its size, or complete an order."
- Owner edits products, pricing, images, stock, Journal entries, and basic pages without a developer.
- Email signup and preorders "only with accurate fulfillment expectations and appropriate platform configuration."
- Foundational SEO, analytics, privacy/legal pages, security, backups, testing.
- Option A (customized Shopify theme) vs option B (custom React storefront on Shopify) to be compared by Miles. This build is option B.

### Timing
- Tapestry preview November 8, 2026. Site target December 1, 2026 (holiday presale). First collection January 2027.
- Defer complex portals, advanced animations, and Growing Service features until after launch.

---

## Where this build disagrees with or extends the client documents

1. **"The Atelier" is missing from the plan.** The Brand Overview lists core destinations as "The House, Collections, The Atelier, Frances Journal, House Tapestry, Care & Services". The Website Brief's page list does not include The Atelier, and the build plan doesn't either. This build follows the Website Brief (no Atelier page) because we don't know what the Atelier would hold. **Open question below.**
2. **Doorways.** The choose-your-path doorways are the developer's addition. They don't conflict with the client's story-first homepage, because scrolling still tells the story in order.
3. **"Mailing list" as homepage step 5** comes from the Website Brief. The Brand Overview's homepage narrative stops at the Journal. Both are honored.
4. **"Care & Service" vs "Care & Services".** The Brief says "Care & Service" and the Overview says "Care & Services". The site uses "Care & Service".
5. **Palette emphasis.** The documents lead with ivory, parchment, and espresso. The developer asked for brown and beige as primary. These are compatible, so every concept stays inside ivory to espresso, and gold stays the only accent.
6. **Design-skill rules vs the brief.** The installed taste skills ban hairline rules, monospace, and index numerals. The client brief asks for typewriter type in letters and the Journal, the plan asks for hairlines and roman numerals, and MMXXVII is a house motif. The client brief wins. Typewriter faces appear only in letters and the Journal.
7. **Imagery.** Unsplash search needs an API key, so placeholders come from public-domain museum collections (Art Institute of Chicago, CC0), stored locally. They are paintings and antique objects, not Jessi Frances pieces. Product imagery is drawn in SVG and clearly placeholder. See `public/placeholders/photos/credits.json`.

---

## What is real vs placeholder on the site

| Real (client wording) | Placeholder |
| --- | --- |
| House name, signature line, approved quotes, North Star | All product prices, sizes, materials, dimensions, care text |
| Frances's role as namesake and the discovery of her letters | Every letter on the site (marked "Placeholder letter") |
| Philosophy of becoming, the five "not" lines | Journal entries (titles, dates, bodies) |
| Object names and their one-line descriptions | Preorder fulfillment wording |
| Tapestry facts: annual, MMXXVII, Nov 8 preview, Madi, ten-year arc | The tapestry artwork itself (original SVG stand-in) |
| Motif list | Symbolism captions on the Tapestry page (written as "what to look for", never as Madi's intent) |
| | Shipping, returns, privacy, terms, FAQ copy |
| | Social links, contact email |

Placeholder strings are commented `// placeholder` in `src/shared/data`.

**Demonstration stock states.** So that every concept shows each state the brief asks for, the mock store sets the Huggie's 8 mm and 9.5 mm sizes to *preorder* and 11 mm to *sold out*, and the three Chapters to *available*, *preorder* and *sold out* respectively. These are not real stock decisions.

**Product drawings.** The Chapters drop shapes (a bud, an open C with a small opal, a bloom) are invented stand-ins drawn from the motif list, labelled "Placeholder drawing" on every image. They are not the real designs.

**Symbol notes.** The "what to look for" notes on each Tapestry page are placeholder invitations, never presented as Madi's or the founder's intent.

---

## Open questions for the client

1. **Tapestry files.** What formats and resolutions will Madi deliver (layered PSD/AI, SVG, PNG)? Is there a mobile (portrait) composition, or do we crop? Can she supply separate layers (ground, vines, bloom, symbols)?
2. **Tapestry rights.** Do the license terms cover web display, animation of layers, social use, and the permanent archive? Please confirm in writing.
3. **Symbolism.** Does Madi or the founder want the symbolism explained on the Tapestry page, and in whose words? (The brief says "discovered, not over-explained".)
4. **December 1.** Is this the public go-live or final prelaunch readiness? Does the holiday presale run on preorders?
5. **Preorder wording.** What exact fulfillment expectation can we promise (for example "ships by late January 2027")? Who confirms it?
6. **Mailing list.** Shopify customer marketing (Shopify Email), Klaviyo, or another tool? Is there a welcome message or incentive?
7. **Accounts.** Who owns and pays for the Shopify store, the domain, and the hosting account (Vercel, Netlify, or Cloudflare)? Who owns the source code?
8. **The Atelier.** It appears in the Brand Overview's destinations. What should it hold (craft process, bespoke appointments, the making of pieces)? Should it launch December 1?
9. **Frances.** Which details of her life, which letters, and which photographs may be published? Who reviews them for accuracy?
10. **Huggie sizes.** Which sizes (inner diameter in mm), metals, and karats? Is there a printable or on-screen fit guide?
11. **Chapters.** What does each drop look like, and is each chapter one object or a family? Will opal appear in any of the first three?
12. **Places.** The overview mentions Sicily and "Cimina, Missouri". Please confirm the spelling and how these places should appear, if at all.
13. **Social.** Which handles (Instagram, Pinterest, other)?
14. **Shipping and returns.** Regions served, shipping carriers, return window, and whether preorders are final sale.
