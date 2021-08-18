import React from 'react'
import { Signup } from '@/presentation/pages'
import { makeLocalSaveToken } from '@/main/factories/usecases/save-access-token/local-save-access-token-factory'
import { makeSignupValidation } from '@/main/factories/pages/signup/signup-validation-factory'
import { makeRemoteAddAccount } from '@/main/factories/usecases/add-account/remote-add-account-factory'

export const makeSignUp: React.FC = () => {
  return (<Signup
    addAccount={makeRemoteAddAccount()}
    validation={makeSignupValidation()}
    saveAccessToken={makeLocalSaveToken()}
  />)
}
