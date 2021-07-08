import React, { useState } from 'react'
import Styles from './login-styles.scss'
import { Footer, FormStatus, Input, LoginHeader } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'

const Login: React.FC = () => {
  const [state] = useState({ isLoading: false, errorMessage: '' })
  const [errorState] = useState({ email: 'Campo Obrigatório', password: 'Campo Obrigatório', main: '' })
  return (
    <div className={Styles.login}>
      <LoginHeader/>
      <Context.Provider value={{ state, errorState }}>
      <form className={Styles.form}>
        <h2>Login</h2>
        <Input type='email' name='email' placeholder={'Digite seu e-mail'}/>
        <Input type='password' name='password' placeholder={'Digite sua senha'}/>
        <button data-testid='submit' className={Styles.submit} disabled type={'submit'}>Entrar</button>
        <span className={Styles.link}>Criar Conta</span>
        <FormStatus/>
      </form>
      </Context.Provider>
      <Footer/>
    </div>
  )
}
export default Login
