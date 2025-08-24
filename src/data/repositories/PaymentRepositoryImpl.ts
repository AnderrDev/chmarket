import type { PaymentRepository } from '../../domain/repositories/payments/PaymentRepository'
import type { PaymentsDataSource } from '../datasources/PaymentsDataSource'
import type { PreferencePayload } from '../entities/order'

export class PaymentRepositoryImpl implements PaymentRepository {
  constructor(private readonly ds: PaymentsDataSource) {}

  createPreference(payload: PreferencePayload) {
    return this.ds.createPreference(payload)
  }
}


