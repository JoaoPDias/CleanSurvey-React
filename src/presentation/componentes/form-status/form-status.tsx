import Styles from '@/presentation/componentes/form-status/form-status-styles.scss'
import Spinner from '@/presentation/componentes/spinner/spinner'
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
