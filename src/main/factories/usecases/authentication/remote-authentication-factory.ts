
import { RemoteAuthentication } from '@/data/usecases/authentication/remote-authentication'
import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory'
import { makeURLAPI } from '@/main/factories/http/api-url-factory'
import { Authentication } from '@/domain/usecases/authentication'

export const makeRemoteAuthentication = (): Authentication => {
  return new RemoteAuthentication(makeURLAPI('/login'), makeAxiosHttpClient())
}
