import type { CatalogViewRow } from './catalog'
import type { ReactNode } from 'react'

export type UseCatalogResult = {
  items: CatalogViewRow[]
  loading: boolean
  error: string | null
  reload: () => void
}

export type AccordionItem = {
  id: string
  question: string
  answer: ReactNode
  defaultOpen?: boolean
}


