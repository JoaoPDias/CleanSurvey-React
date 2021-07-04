import { AxiosHttpClient } from '@/infra/http/axios-http-client/axios-http-client'
import axios from 'axios'
import faker from 'faker'
import { HttpPostParams } from '@/data/protocols/http'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const makeSut = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}

const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.objectElement()
})
describe('AxiosHttpClient', function () {
  test('Should call axios with correct URL and Verb', async () => {
    const request = mockPostRequest()
    const sut = makeSut()
    await sut.post({ url: request.url })
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url)
  })
  test('Should call axios with correct URL and Verb', async () => {
    const url = faker.internet.url()
    const sut = makeSut()
    await sut.post({ url: url })
    expect(mockedAxios.post).toHaveBeenCalledWith(url)
  })
})