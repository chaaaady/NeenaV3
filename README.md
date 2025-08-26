This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project structure (high level)

- `src/components`: decoupled UI components (see `components/index.ts` for stable exports)
- `src/features/donation`: flow/navigation guard and summary
- `src/features/duaa`: Du’a feed hook and constants
- `src/lib`: schema, shared constants, utilities
- `src/styles`: tokens, layout, components, animations (imported from `app/globals.css`)

## Key components

- `AppBar(title?, onMenu?, onTitleClick?)`
- `ProductHeader(currentMosque?, onMosqueSelect?, onInfoNavigation?)`
- `Stepper(activeStep?)`
- `SegmentedControl(options, value, onChange)`
- `Input({ label, value, onChange, ... })`
- `Checkbox({ label, checked, onChange })`
- `Slider({ min, max, step?, value, onChange })`
- `AmountDisplay({ currency?, amount, frequency? })`
- `DonateOverlay({ open, cx, cy, background?, summary, values, onClose })`

## Donation flow

- `useDonationFlow()` exposes navigation helpers and guards
- `buildDonationSummary(values)` returns a friendly confirmation sentence

## Du’a

- `useDuaaFeed()` → `{ sortedFeed, visibleCount, showMore, addPost, like, repost, addComment }`
- `DUAA_INTRO`: welcoming intro text

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
