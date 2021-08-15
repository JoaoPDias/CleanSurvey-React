import React, { useEffect, useState } from 'react'
import Styles from './signup-styles.scss'
import { Footer, FormStatus, Input, LoginHeader } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'

type Props = {
  validation: Validation
}
const Signup: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    name: '',
    email: '',
    nameError: '',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    passwordConfirmationError: 'Campo obrigatório',
    mainError: ''
  })

  useEffect(() => {
    setState({
      ...state,
      nameError: validation.validate('name', state.name),
      emailError: validation.validate('email', state.email)
    })
  }
  , [state.name, state.email])
  return (
    <div className={Styles.signup}>
      <LoginHeader/>
      <Context.Provider value={{
        state,
        setState
      }}>
        <form className={Styles.form}>
          <h2>Criar Conta</h2>
          <Input type="text" name="name" placeholder={'Digite seu nome'}/>
          <Input type="email" name="email" placeholder={'Digite seu e-mail'}/>
          <Input type="password" name="password" placeholder={'Digite sua senha'}/>
          <Input type="password" name="passwordConfirmation" placeholder={'Repita sua senha'}/>
          <button className={Styles.submit} data-testid={'submit'} disabled
                  type={'submit'}>Criar Conta
          </button>
          <span className={Styles.link}>Logar-se</span>
          <FormStatus/>
        </form>
      </Context.Provider>
      <Footer/>
    </div>
  )
}
export default Signup
