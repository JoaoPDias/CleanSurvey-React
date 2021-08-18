import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory'
import { makeURLAPI } from '@/main/factories/http/api-url-factory'
import { RemoteAddAccount } from '@/data/usecases/add-account/remote-add-account'
import { AddAccount } from '@/domain/usecases'

export const makeRemoteAddAccount = (): AddAccount => {
  return new RemoteAddAccount(makeURLAPI('/signup'), makeAxiosHttpClient())
}
