export interface AdminContentRepository {
  get(key: string): Promise<{ key: string; data: Record<string, unknown> }>
  set(key: string, data: Record<string, unknown>): Promise<void>
}


