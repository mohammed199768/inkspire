import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import React from 'react'

// Mock next/image to avoid Next.js-specific errors in tests
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return React.createElement('img', props)
  },
}))

// Mock next/navigation only if needed by tested components
// Currently ServiceCard doesn't use routing, so commenting out:
// vi.mock('next/navigation', () => ({
//   useRouter: () => ({ push: vi.fn(), pathname: '/' }),
//   usePathname: () => '/',
// }))
