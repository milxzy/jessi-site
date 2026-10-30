# Owner guide: what you change, and where

Everything you'll want to update day to day is done in your **Shopify admin**. You never need to touch the website's code. Changes appear on the site within a minute or two.

## Your jewelry

**Products** (Shopify: Products)

- **Name, description, price, photos:** edit the product and save.
- **Huggie sizes:** each size is a *variant*. Add, rename, or reprice sizes under Variants. Keep the option called "Size".
- **Stock:** set quantities under Inventory. When a size reaches zero:
  - if "Continue selling when out of stock" is **off**, the site shows **Sold out**.
  - if it's **on**, the site shows **Preorder**.
- **Preorder shipping note:** in the product's *Metafields* section, fill in **Fulfillment note**. Example: "Ships by late January 2027." The site always shows this beside a preorder, so please keep it accurate.
- **Details** (in Metafields): Materials, Dimensions, Care, Size guide, Chapter meaning, and Chapters compatibility. Leave any of them blank and that line simply won't appear.

**Chapters** are separate products with the product type `Chapter`, kept in the collection **Chapters**. To add a new chapter, duplicate an existing one, change the name, photo, meaning, and price, and keep it in that collection.

## The Frances Journal

(Shopify: Online Store, Blog posts, in the blog called **Journal**)

1. Click **Add blog post**.
2. Write a **title**, the **content**, and a short **excerpt** (the one or two lines shown in lists).
3. Add a **featured image** for the cover.
4. Add one **tag**, such as Letters, Reflections, or Women's stories. The first tag shows as the category.
5. Set visibility to **Visible** and save. The newest entry appears first.

Inside a post:

- A **quote** block becomes a large pull quote.
- To show a **typed letter**, click the `<>` (show HTML) button and wrap the letter like this:
  `<div class="letter"><p>Your text here</p></div>`
  It will appear in a typewriter style on its own sheet.
- Add a **caption** under an image with the image's caption field.

## Pages

(Shopify: Online Store, Pages)

| Page | What it controls |
| --- | --- |
| **The House** | The founder's story section on The House page |
| **Care** | The Care & Service page. Each *Heading 2* starts a new section. Inside the section titled **Questions**, each *Heading 3* is one question, with its answer underneath. |
| **Shipping & Returns**, **Privacy**, **Terms** | The legal pages linked in the footer |

Please keep each page's *handle* (the end of its web address) as it is, because that's how the site finds it.

## The House Tapestry

Each year's tapestry is added by your developer for now. Send the artwork files to Miles. In a later phase this can become a simple form in Shopify, so you can add each new year yourself.

## Checkout, orders, and payments

All of these are Shopify's. Orders, refunds, shipping labels, and taxes work exactly as they do in any Shopify store. You can style the checkout page to match the site under **Settings, Checkout**.

## What needs a developer

Changing the layout, colors, typefaces, or adding new kinds of pages. Everything else above is yours.
