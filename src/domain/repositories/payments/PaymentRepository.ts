import type { PreferencePayload } from '../../../services/mp'

export interface PaymentRepository {
  createPreference(payload: PreferencePayload): Promise<{
    order_number: string
    preference_id: string
    init_point: string
    sandbox_init_point?: string
    total_cents: number
    currency: string
  }>
}


