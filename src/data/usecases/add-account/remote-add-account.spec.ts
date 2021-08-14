import * as faker from 'faker'
import { HttpPostClientSpy } from '@/data/test'
import { AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/model/account-model'
import { mockAddAccountParams } from '@/domain/test'
import { RemoteAddAccount } from '@/data/usecases/add-account/remote-add-account'
import { HttpStatusCode } from '@/data/protocols/http'
import { EmailInUseError } from '@/domain/errors/email-in-use-error'

type SutTypes = {
  sut: RemoteAddAccount
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
  const sut = new RemoteAddAccount(url, httpPostClientSpy)
  return {
    sut,
    httpPostClientSpy
  }
}
describe('RemoteAddAccount', function () {
  test('should RemoteAddAccount calls HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const {
      sut,
      httpPostClientSpy
    } = makeSut(url)
    await sut.add(mockAddAccountParams())
    expect(httpPostClientSpy.url).toBe(url)
  })
  test('should RemoteAddAccount calls HttpPostClient with correct body ', async () => {
    const addAccountParams = mockAddAccountParams()
    const { sut, httpPostClientSpy } = makeSut()
    await sut.add(addAccountParams)
    expect(httpPostClientSpy.body).toEqual(addAccountParams)
  })
  test('should RemoteAddAccount throws EmailInUseError when HttpPostClient returns 403 ', async () => {
    const addAccountParams = mockAddAccountParams()
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.add(addAccountParams)
    await expect(promise).rejects.toThrow(new EmailInUseError())
  })
})
