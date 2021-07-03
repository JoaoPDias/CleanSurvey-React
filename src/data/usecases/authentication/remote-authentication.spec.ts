import { RemoteAuthentication } from './remote-authentication'
import { HttpPostClientSpy } from '@/data/test/mock-http-client'
import { HttpStatusCode } from '@/data/protocols/http/http-response'
import { mockAccountModel, mockAuthentication } from '@/domain/test/mock-account'
import { InvalidCredentialsError } from '@/domain/errors/invalid-credentials-error'
import faker from 'faker'
import { UnexpectedError } from '@/domain/errors/unexpected-error'
import { AuthenticationParams } from '@/domain/usecases/authentication'
import { AccountModel } from '@/domain/model/account-model'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}
const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)
  return { sut, httpPostClientSpy }
}
const HttpErrors = [HttpStatusCode.badRequest, HttpStatusCode.notFound, HttpStatusCode.serverError]
describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct URL ', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.auth(mockAuthentication())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpPostClient with correct body ', async () => {
    const authenticationParams = mockAuthentication()
    const { sut, httpPostClientSpy } = makeSut()
    await sut.auth(authenticationParams)
    expect(httpPostClientSpy.body).toEqual(authenticationParams)
  })
  test('Should throw InvalidCredentialsError if HttpPostClient returns 401 ', async () => {
    const authenticationParams = mockAuthentication()
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = sut.auth(authenticationParams)
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test.each(HttpErrors)('Should throw UnexpectedError if HttpPostClient returns %p', async (httpStatusCode) => {
    const authenticationParams = mockAuthentication()
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: httpStatusCode
    }
    const promise = sut.auth(authenticationParams)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return an AccountModel if HttpPostClient returns 200 ', async () => {
    const authenticationParams = mockAuthentication()
    const { sut, httpPostClientSpy } = makeSut()
    const httpResult = mockAccountModel()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const account = await sut.auth(authenticationParams)
    await expect(account).toEqual(httpResult)
  })
})
