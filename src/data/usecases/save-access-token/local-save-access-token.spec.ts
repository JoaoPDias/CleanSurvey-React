import * as faker from 'faker'
import { SetStorageSpy } from '@/data/test'
import { LocalSaveAccessToken } from '@/data/usecases/save-access-token/local-save-access-token'

describe('LocalSaveAccessToken', function () {
  test('Should LocalSaveAccessToken', async () => {
    const setStorageSpy = new SetStorageSpy()
    const sut = new LocalSaveAccessToken(setStorageSpy)
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)
    expect(setStorageSpy.key).toBe('accessToken')
    expect(setStorageSpy.value).toBe(accessToken)
  })
})
