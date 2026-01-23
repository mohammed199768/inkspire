import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionTitle from '@/components/ui/SectionTitle'

describe('SectionTitle', () => {
  it('renders title and highlight text', () => {
    render(
      <SectionTitle 
        title="Our Latest"
        highlight="Projects"
      />
    )
    
    expect(screen.getByText(/Our Latest/)).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('applies custom highlight color', () => {
    render(
      <SectionTitle 
        title="Our"
        highlight="Work"
        highlightColor="text-blue-500"
      />
    )
    
    const highlightSpan = screen.getByText('Work')
    expect(highlightSpan).toHaveClass('text-blue-500')
  })

  it('renders as h2 element', () => {
    const { container } = render(
      <SectionTitle 
        title="Test"
        highlight="Title"
      />
    )
    
    const heading = container.querySelector('h2')
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Test Title')
  })

  it('applies default accentPurple highlight color when not specified', () => {
    render(
      <SectionTitle 
        title="Default"
        highlight="Color"
      />
    )
    
    const highlightSpan = screen.getByText('Color')
    expect(highlightSpan).toHaveClass('text-accentPurple')
  })
})
