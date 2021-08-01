import * as faker from 'faker'
import { SetStorageSpy } from '@/data/test'
import { LocalSaveAccessToken } from '@/data/usecases/save-access-token/local-save-access-token'

type SutTypes = {
  sut: LocalSaveAccessToken
  setStorageSpy: SetStorageSpy
}

const makeSut = (): SutTypes => {
  const setStorageSpy = new SetStorageSpy()
  const sut = new LocalSaveAccessToken(setStorageSpy)
  return {
    sut,
    setStorageSpy
  }
}
describe('LocalSaveAccessToken', function () {
  test('Should LocalSaveAccessToken', async () => {
    const {
      sut,
      setStorageSpy
    } = makeSut()
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)
    expect(setStorageSpy.key).toBe('accessToken')
    expect(setStorageSpy.value).toBe(accessToken)
  })
})
