# Performance Optimization Report

## Key Improvements

### 1. **LCP (Largest Contentful Paint)**

- **Optimized Hero Images**: Added `priority` only to the primary visible background image in `HeroScene`.
- **Local Font Loading**: Migrated from manual CSS `@font-face` to `next/font/local`. This allows Next.js to preload critical font data and inline font CSS, eliminating network roundtrips and drastically reducing Text render delay.
- **Server Components**: Converted the `Home` page (`page.tsx`) to a Server Component. This delivers the initial HTML immediately without waiting for the large hydration bundle.

### 2. **CLS (Cumulative Layout Shift)**

- **Font Display**: Utilized `next/font` with `swapping` strategy to prevent FOIT (Flash of Invisible Text) while minimizing layout shifts.
- **Image Sizing**: Replaced `<img>` tags with `next/image` (in `ClientsMarquee` and `HeroScene`), enforcing strict aspect ratios and `fill` behavior to prevent content jumping.
- **Fixed Dimensions**: Background particles and effects are strictly positioned out of the document flow (`fixed`), ensuring they never shift layout.

### 3. **INP (Interaction to Next Paint) & TBT (Total Blocking Time)**

- **Dynamic Imports**: Lazy-loaded heavy, non-critical components (`FloatingVectorParticles`, `BackgroundParticles`, `BlobBackground`, `Cursor`) and below-the-fold sections. They now hydrate *after* the main thread is free.
- **Optimized GSAP Hooks**:
  - Extracted `useFloatingParticles` to handle particle logic efficiently.
  - Extracted `useHeroAnimation` to use `gsap.context`, ensuring proper cleanup and preventing memory leaks.
  - Moved `useCinematicTransitions` to a client-side wrapper, isolating the "heavy" logic from the main page render.
- **Component Isolation**: Split the monolithic `page.tsx` client bundle into smaller chunks.

### 4. **Code Architecture**

- **SOLID Principles**: Decoupled logic (hooks) from presentation (components).
- **Separation of Concerns**: `CinematicWrapper` handles scroll effects; `HeroScene` handles hero logic; `layout.tsx` handles global providers/fonts.
- **Clean Code**: Removed duplicate logic and manual resource loading hacks.

## Future Recommendations

- **Image Formats**: Ensure all source images (backgrounds) are available in WebP or AVIF format. `next/image` handles this if the source is local or a supported CDN, but Unsplash logic is already handled.
- **Bundle Analysis**: Periodically run `@next/bundle-analyzer` to ensure no large libraries (like `three.js` or full `lodash`) sneak into the main bundle.
- **Third Party Scripts**: If you add analytics, use `next/script` with `strategy="lazyOnload"` or `strategy="worker"`.
