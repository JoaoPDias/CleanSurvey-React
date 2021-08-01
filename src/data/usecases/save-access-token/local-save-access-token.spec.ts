import * as faker from 'faker'
import { SetStorageMock } from '@/data/test'
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
  test('Should LocalSaveAccessToken', async () => {
    const {
      sut,
      setStorageMock
    } = makeSut()
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)
    expect(setStorageMock.key).toBe('accessToken')
    expect(setStorageMock.value).toBe(accessToken)
  })
})
