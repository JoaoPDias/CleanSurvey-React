import React, { memo } from 'react'
import Styles from '@/presentation/components/login-header/login-header-styles.scss'
import { Logo } from '@/presentation/components'

const LoginHeader: React.FC = () => {
  return (
    <header className={Styles.header}>
      <Logo/>
      <h1>4DEV - Enquetes para Programadores</h1>
    </header>
  )
}

export default memo(LoginHeader)
