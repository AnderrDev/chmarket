import type { AdminSettingsRepository } from '../../repositories/admin/AdminSettingsRepository'

export class GetSettingUseCase {
  constructor(private readonly repository: AdminSettingsRepository) {}
  execute(key: string) { return this.repository.get(key) }
}


