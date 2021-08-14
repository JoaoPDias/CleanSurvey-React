import { HttpPostClient } from '@/data/protocols/http'
import { AddAccountParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/model/account-model'

export class RemoteAddAccount {
  constructor (private readonly url: string, private readonly httpPostClient: HttpPostClient<AddAccountParams, AccountModel>) {
  }

  async add (addAccountParams: AddAccountParams): Promise<AccountModel> {
    const httpResponse = await this.httpPostClient.post({
      url: this.url,
      body: addAccountParams
    })
    return null
  }
}
