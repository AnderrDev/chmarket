import type { AdminContentRepository } from '../../repositories/admin/AdminContentRepository'

export class GetContentBlockUseCase {
  constructor(private readonly repository: AdminContentRepository) {}

  execute(key: string) {
    return this.repository.get(key)
  }
}


