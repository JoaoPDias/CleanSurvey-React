import Styles from './form-status-styles.scss'
import { Spinner } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import React, { useContext } from 'react'

const FormStatus: React.FC = () => {
  const { state } = useContext(Context)
  return (
    <div data-testid='errorWrap' className={Styles.errorWrap}>
      {state.isLoading && <Spinner className={Styles.spinner}/>}
      {state.mainError && <span data-testid='main-error' className={Styles.error}>{state.mainError}</span>}
    </div>
  )
}

export default FormStatus
