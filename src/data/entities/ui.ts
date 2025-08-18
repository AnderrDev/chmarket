import type { CatalogViewRow } from './catalog'

export type UseCatalogResult = {
  items: CatalogViewRow[]
  loading: boolean
  error: string | null
  reload: () => void
}

export type AccordionItem = {
  id: string
  question: string
  answer: string
  defaultOpen?: boolean
}


