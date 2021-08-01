import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import * as faker from 'faker'
import 'jest-localstorage-mock'

describe('LocalStorageAdapter', function () {
  beforeEach(() => {
    localStorage.clear()
  })
  test('Should LocalStorageAdapter calls LocalStorage with correct values', async () => {
    const sut = new LocalStorageAdapter()
    const key = faker.database.column()
    const value = faker.random.word()
    await sut.set(key, value)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, value)
  })
})
