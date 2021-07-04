import Styles from '@/presentation/components/form-status/form-status-styles.scss'
import { Spinner } from '@/presentation/components'
import React from 'react'

const FormStatus: React.FC = () => {
  return (
    <div className={Styles.errorWrap}>
      <Spinner className={Styles.spinner}/>
      <span className={Styles.error}>Erro</span>
    </div>
  )
}

export default FormStatus
