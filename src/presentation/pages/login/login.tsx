import React from 'react'
import Styles from './login-styles.scss'
import Spinner from '@/presentation/componentes/spinner/spinner'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <header className={Styles.header}>
        <img src={'https://upload.wikimedia.org/wikipedia/commons/a/ab/Android_O_Preview_Logo.png'} alt='Logo'/>
        <h1>4DEV - Enquetes para Programadores</h1>
      </header>
      <form className={Styles.form}>
        <h2>Login</h2>
        <div className={Styles.inputWrap}>
          <input type='email' name='email' placeholder={'Digite seu e-mail'}/>
          <span className={Styles.status}>🔴</span>
        </div>
        <div className={Styles.inputWrap}>
          <input type='password' name='password' placeholder={'Digite sua senha'}/>
          <span className={Styles.status}>🔴</span>
        </div>
        <button className={Styles.submit} type={'submit'}>Entrar</button>
        <span className={Styles.link}>Criar Conta</span>
        <div className={Styles.errorWrap}>
          <Spinner className={Styles.spinner}/>
          <span className={Styles.error}>Erro</span>
        </div>
      </form>
      <footer className={Styles.footer}/>
    </div>
  )
}
export default Login
