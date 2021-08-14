import * as faker from 'faker'
import { HttpPostClientSpy } from '@/data/test'
import { AddAccountParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/model/account-model'
import { HttpPostClient } from '@/data/protocols/http'
import { mockAddAccountParams } from '@/domain/test'

class RemoteAddAccount {
  constructor (private readonly url: string, private readonly httpPostClient: HttpPostClient<AddAccountParams, AccountModel>) {
  }

  async add (addAccountParams: AddAccountParams) {
    
  }
}

describe('RemoteAddAccount', function () {
  test('Should RemoteAddAccount calls HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const httpPostClientSpy = new HttpPostClientSpy<AddAccountParams, AccountModel>()
    const sut = new RemoteAddAccount(url, httpPostClientSpy)
    await sut.add(mockAddAccountParams())
    expect(httpPostClientSpy.url).toBe(url)
  })
})
