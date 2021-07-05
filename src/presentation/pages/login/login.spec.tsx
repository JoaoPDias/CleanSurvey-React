import React from 'react'
import { render } from '@testing-library/react'
import { Login } from '@/presentation/pages'

describe('Login Component', () => {
  test('Should start with inital state', () => {
    const { getByTestId } = render(<Login/>)
    const errorWrap = getByTestId('errorWrap')
    expect(errorWrap.childElementCount).toBe(0)
    const submitButton = getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeTruthy()
  })
})
