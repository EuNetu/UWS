import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { uploadImage } from './upload-image'
import { eq } from 'drizzle-orm'
import { InvalidFileFormat } from './errors/invalid-file-format'

describe('uploadImage', () => {
  beforeAll(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => ({
      uploadFileToStorage: vi.fn().mockImplementation(() => {
        return {
          key: `${randomUUID()}.jpg`,
          url: 'https://storage.com/image.jpg',
        }
      }),
    }))
  })

  it('should be able to upload an image', async () => {
    const fileName = `${randomUUID()}.jpg`

    const sut = await uploadImage({
      fileName,
      contentType: 'image/jpg',
      contentStream: Readable.from([]),
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.uploads)
      .where(eq(schema.uploads.name, fileName))

    expect(result).toHaveLength(1)
  })

  it('should not be able to upload an invalid file', async () => {
    const fileName = `${randomUUID()}.pdf`

    const sut = await uploadImage({
      fileName,
      contentType: 'document/pdf',
      contentStream: Readable.from([]),
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidFileFormat)
  })
})
