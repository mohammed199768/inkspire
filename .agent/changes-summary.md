# Changes Summary

## Font Integration
- **Custom Font Added**: Integrated `ibrand.otf` as the primary brand font.
- **Location**: Moved font file to `app/fonts/ibrand.otf` for proper Next.js App Router compatibility.
- **Configuration**: Configured `localFont` in `app/layout.tsx` with the variable `--font-ibrand`.
- **Troubleshooting**: Renamed font file to lowercase `ibrand.otf` to resolve build tool case-sensitivity issues.

## Styling Updates
- **Global CSS**: Added `.brand-font` utility class in `app/globals.css` to easily apply the font.
- **Component Updates**:
    - **Preloader**: Applied `brand-font` to the "INKSPIRE" loading text.
    - **Navbar**: Applied `brand-font` to the "INKSPIRE" logo text.
    - **Hero Section**: Applied `brand-font` to the main "INKSPIRE TELLS YOUR STORY" title.

## Reverted Changes
- **Glassmorphism**: Reverted glassmorphism styles (backdrop blur, borders) in `ProcessTimeline.tsx`, `PortfolioGrid.tsx`, `StoryScrollytelling.tsx`, and `app/contact/page.tsx` to resolve visual conflicts ("two style" issue) reported by the user.

## Troubleshooting
- Resolved `next/font` path resolution errors by restructuring the font directory.
- Cleared Next.js cache to resolve build artifacts corruption.
- Restored `app/layout.tsx` after accidental corruption.
