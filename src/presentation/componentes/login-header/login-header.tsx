import React, { memo } from 'react'
import Styles from '@/presentation/componentes/login-header/login-header-styles.scss'
import Logo from '@/presentation/componentes/logo/logo'

const LoginHeader: React.FC = () => {
  return (
    <header className={Styles.header}>
      <Logo/>
      <h1>4DEV - Enquetes para Programadores</h1>
    </header>
  )
}

export default memo(LoginHeader)
