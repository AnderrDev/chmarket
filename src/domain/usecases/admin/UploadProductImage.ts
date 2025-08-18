import type { AdminMediaDataSource } from '../../../data/datasources/AdminMediaDataSource'

export class UploadProductImageUseCase {
  constructor(private readonly ds: AdminMediaDataSource) {}

  execute(payload: { file: File; folder?: string }): Promise<{ url: string; key: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
      reader.onload = async () => {
        try {
          const base64 = String(reader.result).split(',')[1] || ''
          const res = await this.ds.uploadImage({
            fileName: payload.file.name,
            contentType: payload.file.type || 'application/octet-stream',
            dataBase64: base64,
            folder: payload.folder ?? 'products',
          })
          resolve(res)
        } catch (e) {
          reject(e)
        }
      }
      reader.readAsDataURL(payload.file)
    })
  }
}


