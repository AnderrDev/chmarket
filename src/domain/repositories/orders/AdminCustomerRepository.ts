export interface AdminCustomerRepository {
  list(params?: { page?: number; pageSize?: number; q?: string }): Promise<{ items: Array<{ email: string; orders_count: number; total_spent_cents: number; last_order_at: string; first_order_at: string }>; page: number; pageSize: number; total: number }>
  get(email: string): Promise<{ email: string; orders: Array<{ order_number: string; status: string; payment_status?: string | null; total_cents: number; currency: string; created_at: string }> }>
}


