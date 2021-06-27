import { HttpPostClient } from 'data/protocols/http/http-post-client'

class RemoteAuthentication {
  constructor (private readonly url: string, private readonly httpPostClient: HttpPostClient) {}

  async auth (): Promise<void> {
    await this.httpPostClient.post(this.url)
  }
}

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct URL ', async () => {
    const url = 'any_url'
    class HttpPostClientSpy implements HttpPostClient {
      url?: string
      async post (url: string): Promise<void> {
        this.url = url
        return await Promise.resolve()
      }
    }
    const httpPostClientSpy = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(url, httpPostClientSpy)
    await sut.auth()
    expect(httpPostClientSpy.url).toBe(url)
  })
})
