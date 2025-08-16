import type { PaymentRepository } from '../PaymentRepository'
import type { PreferencePayload } from '../../../services/mp'

export class CreatePreferenceUseCase {
  constructor(private readonly repository: PaymentRepository) {}

  async execute(payload: PreferencePayload) {
    return this.repository.createPreference(payload)
  }
}


