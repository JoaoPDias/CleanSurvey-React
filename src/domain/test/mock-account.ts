import faker from 'faker'
import { AuthenticationParams } from '@/domain/usecases/authentication'
import { AccountModel } from '@/domain/model/account-model'
import { AddAccountParams } from '@/domain/usecases'

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAddAccountParams = (): AddAccountParams => {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: password,
    passwordConfirmation: password
  }
}

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.datatype.uuid()
})
