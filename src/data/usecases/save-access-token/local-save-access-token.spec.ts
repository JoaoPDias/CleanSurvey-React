import * as faker from 'faker'
import { SetStorageMock } from '@/data/test'
import { UnexpectedError } from '@/domain/errors'
import { LocalSaveAccessToken } from '@/data/usecases/save-access-token/local-save-access-token'

type SutTypes = {
  sut: LocalSaveAccessToken
  setStorageMock: SetStorageMock
}

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock()
  const sut = new LocalSaveAccessToken(setStorageMock)
  return {
    sut,
    setStorageMock
  }
}
describe('LocalSaveAccessToken', function () {
  test('should LocalSaveAccessToken save accessToken returned', async () => {
    const {
      sut,
      setStorageMock
    } = makeSut()
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)
    expect(setStorageMock.key).toBe('accessToken')
    expect(setStorageMock.value).toBe(accessToken)
  })
  test('should LocalSaveAccessToken throw an error when Request fails', async () => {
    const {
      sut,
      setStorageMock
    } = makeSut()
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(new Error())
    const promise = sut.save(faker.datatype.uuid())
    await expect(promise).rejects.toThrow(new Error())
  })
  test('should LocalSaveAccessToken throw an error when accessToken is falsy', async () => {
    const {
      sut
    } = makeSut()
    const promise = sut.save(undefined)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
