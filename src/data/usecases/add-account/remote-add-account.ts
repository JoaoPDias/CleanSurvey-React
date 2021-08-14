import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http'
import { AddAccountParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/model/account-model'
import { EmailInUseError } from '@/domain/errors/email-in-use-error'

export class RemoteAddAccount {
  constructor (private readonly url: string, private readonly httpPostClient: HttpPostClient<AddAccountParams, AccountModel>) {
  }

  async add (addAccountParams: AddAccountParams): Promise<AccountModel> {
    const httpResponse = await this.httpPostClient.post({
      url: this.url,
      body: addAccountParams
    })
    switch (httpResponse.statusCode) {
      case HttpStatusCode.forbidden:throw new EmailInUseError()
    }
    return null
  }
}
