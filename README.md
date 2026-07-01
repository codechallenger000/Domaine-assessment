# Domaine product card

Small Shopify theme build for the Domaine front-end assessment. The product card is written from scratch in Liquid, styled with TailwindCSS, and uses a small JavaScript file for color selection, price changes, and image swaps.

## What is included

- `snippets/product-card.liquid` - the reusable Shopify card
- `sections/featured-product-card.liquid` - a theme section for the homepage
- `assets/product-card.js` - swatch, image, badge, and price behavior
- `src/styles/tailwind.css` - Tailwind source styles
- `assets/theme.css` - compiled theme CSS
- `index.html` - static preview for quick review

## Run locally

The static preview is useful for a quick review before connecting Shopify:

```bash
npm run preview
```

For Shopify theme work:

```bash
npm install
npm run build:css
npm run dev -- --store=domaine-fxqdva6a.myshopify.com
```

The Shopify command needs a real development store. Without the `--store` value, Shopify CLI stops before it can serve the theme.

## Notes

- Sale products show a badge and compare-at pricing.
- Swatches update the active image, price, sale state, and selected state.
- Hovering the card reveals the secondary image for the current selection.
- The card shows vendor, product title, and pricing.
