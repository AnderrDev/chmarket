import type { AdminContentRepository } from '../../repositories/admin/AdminContentRepository'

export class SetContentBlockUseCase {
  constructor(private readonly repository: AdminContentRepository) {}

  execute(key: string, data: Record<string, unknown>) {
    return this.repository.set(key, data)
  }
}


