import { isRight, unwrapEither } from '@/infra/shared/either'
import { makeUpload } from '@/test/factories/make-upload'
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { getUploads } from './get-uploads'

describe('get-uploads', () => {
  it('should be able to get the uploads', async () => {
    const namePattern = `${randomUUID()}.webp`

    const upload1 = await makeUpload({ name: namePattern })
    const upload2 = await makeUpload({ name: namePattern })
    const upload3 = await makeUpload({ name: namePattern })
    const upload4 = await makeUpload({ name: namePattern })
    const upload5 = await makeUpload({ name: namePattern })

    const sut = await getUploads({
      searchQuery: namePattern,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).uploads).toHaveLength(5)

    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })
  
  it('should be able to get paginated uploads', async () => {
    const namePattern = randomUUID()
    
    const upload1 = await makeUpload({ name: `${namePattern}.webp` })
    const upload2 = await makeUpload({ name: `${namePattern}.webp` })
    const upload3 = await makeUpload({ name: `${namePattern}.webp` })
    const upload4 = await makeUpload({ name: `${namePattern}.webp` })
    const upload5 = await makeUpload({ name: `${namePattern}.webp` })

    let sut = await getUploads({
      searchQuery: namePattern,
      page: 1,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
    ])

    sut = await getUploads({
      searchQuery: namePattern,
      page: 2,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it('should be able to get sorted uploads', async () => {
    const namePattern = `${randomUUID()}.webp`

    const upload1 = await makeUpload({ name: namePattern })
    const upload2 = await makeUpload({ name: namePattern })
    const upload3 = await makeUpload({ name: namePattern })
    const upload4 = await makeUpload({ name: namePattern })
    const upload5 = await makeUpload({ name: namePattern })

    const sut = await getUploads({
      searchQuery: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).uploads).toHaveLength(5)

    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload1.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload5.id }),
    ])
  })
  

})
