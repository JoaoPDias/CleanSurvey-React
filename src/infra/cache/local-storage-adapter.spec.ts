import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import * as faker from 'faker'
import 'jest-localstorage-mock'

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter()
describe('LocalStorageAdapter', function () {
  beforeEach(() => {
    localStorage.clear()
  })
  test('should LocalStorageAdapter calls LocalStorage with correct values', async () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = faker.random.word()
    await sut.set(key, value)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, value)
    expect(localStorage.__STORE__[key]).toBe(value)
    expect(Object.keys(localStorage.__STORE__).length).toBe(1)
  })
})
