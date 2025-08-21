import type { AdminSettingsRepository } from '../../repositories/admin/AdminSettingsRepository'

export class SetSettingUseCase {
  constructor(private readonly repository: AdminSettingsRepository) {}
  execute(key: string, value: Record<string, unknown>) { return this.repository.set(key, value) }
}


