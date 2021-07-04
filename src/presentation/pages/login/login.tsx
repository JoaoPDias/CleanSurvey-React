import React from 'react'
import Styles from './login-styles.scss'
import Spinner from '@/presentation/componentes/spinner/spinner'
import LoginHeader from '@/presentation/componentes/login-header/login-header'
import Footer from '@/presentation/componentes/footer/footer'
import Input from '@/presentation/componentes/input/input'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <LoginHeader/>
      <form className={Styles.form}>
        <h2>Login</h2>
        <Input type='email' name='email' placeholder={'Digite seu e-mail'}/>
        <Input type='password' name='password' placeholder={'Digite sua senha'}/>
        <button className={Styles.submit} type={'submit'}>Entrar</button>
        <span className={Styles.link}>Criar Conta</span>
        <div className={Styles.errorWrap}>
          <Spinner className={Styles.spinner}/>
          <span className={Styles.error}>Erro</span>
        </div>
      </form>
      <Footer/>
    </div>
  )
}
export default Login
