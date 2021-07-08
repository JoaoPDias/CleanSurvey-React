import React, { useEffect, useState } from 'react'
import Styles from './login-styles.scss'
import { Footer, FormStatus, Input, LoginHeader } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'

type Props ={
  validation: Validation
}
const Login: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    errorMessage: '',
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })
  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password)
    })
  }
  , [state.email, state.password])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setState({
      ...state,
      ...state,
      isLoading: true
    })
  }

  return (
    <div className={Styles.login}>
      <LoginHeader/>
      <Context.Provider value={{ state, setState }}>
      <form className={Styles.form} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <Input type='email' name='email' placeholder={'Digite seu e-mail'}/>
        <Input type='password' name='password' placeholder={'Digite sua senha'}/>
        <button data-testid='submit' className={Styles.submit} disabled ={!!state.emailError || !!state.passwordError} type={'submit'}>Entrar</button>
        <span className={Styles.link}>Criar Conta</span>
        <FormStatus/>
      </form>
      </Context.Provider>
      <Footer/>
    </div>
  )
}
export default Login
