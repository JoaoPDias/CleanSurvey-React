import { AddAccount, AddAccountParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/model'
import { mockAccountModel } from '@/domain/test'

export class AddAccountSpy implements AddAccount {
  params: AddAccountParams
  account = mockAccountModel()

  async add (params: AddAccountParams): Promise<AccountModel> {
    this.params = params
    return this.account
  }
}
