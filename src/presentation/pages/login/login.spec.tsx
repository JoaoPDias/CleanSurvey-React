import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import { Login } from '@/presentation/pages'

type SutTypes = {
  sut: RenderResult
}
const makeSut= ():SutTypes =>{
  const sut = render(<Login/>)
  return {sut}
}
describe('Login Component', () => {
  test('Should start with inital state', () => {
    const {sut} = makeSut()
    const errorWrap = sut.getByTestId('errorWrap')
    expect(errorWrap.childElementCount).toBe(0)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeTruthy()
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe('Campo Obrigatório')
    expect(emailStatus.textContent).toBe('🔴')
    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.textContent).toBe('🔴')
  })
})
