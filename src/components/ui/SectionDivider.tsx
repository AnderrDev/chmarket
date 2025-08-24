import { ChevronDown } from 'lucide-react'

type SectionDividerProps = {
  variant?: 'simple' | 'chevron' | 'gradient'
  className?: string
}

export default function SectionDivider({ variant = 'simple', className = '' }: SectionDividerProps) {
  if (variant === 'chevron') {
    return (
      <div className={`flex justify-center py-4 ${className}`}>
        <div className="w-8 h-8 rounded-full bg-ch-dark-gray border border-ch-gray/20 flex items-center justify-center">
          <ChevronDown className="w-4 h-4 text-ch-gray" />
        </div>
      </div>
    )
  }

  if (variant === 'gradient') {
    return (
      <div className={`h-px bg-gradient-to-r from-transparent via-ch-gray/15 to-transparent my-8 ${className}`} />
    )
  }

  // Simple variant (default)
  return (
    <div className={`h-px bg-ch-gray/10 ${className}`} />
  )
}
