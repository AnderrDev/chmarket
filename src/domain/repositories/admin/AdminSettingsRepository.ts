export interface AdminSettingsRepository {
  get(key: string): Promise<{ key: string; value: Record<string, unknown> }>
  set(key: string, value: Record<string, unknown>): Promise<void>
}


