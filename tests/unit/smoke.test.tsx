import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ServiceCard } from '@/components/contact/ServiceCard'

describe('ServiceCard', () => {
  it('renders with title and icon', () => {
    const mockClick = vi.fn()
    
    render(
      <ServiceCard 
        icon="Laptop"
        title="Web Development"
        desc="Custom websites and applications."
        selected={false}
        onClick={mockClick}
      />
    )
    
    expect(screen.getByText('Web Development')).toBeInTheDocument()
    expect(screen.getByText(/Custom websites/)).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const mockClick = vi.fn()
    const user = userEvent.setup()
    
    render(
      <ServiceCard 
        icon="Laptop"
        title="Web Development"
        selected={false}
        onClick={mockClick}
      />
    )
    
    await user.click(screen.getByText('Web Development'))
    expect(mockClick).toHaveBeenCalledTimes(1)
  })

  it('shows selected state styling', () => {
    render(
      <ServiceCard 
        icon="Laptop"
        title="Web Development"
        selected={true}
        onClick={vi.fn()}
      />
    )
    
    const card = screen.getByText('Web Development').closest('div')
    expect(card).toHaveClass('bg-purple-500/20')
  })
})
