import { render, RenderResult } from '@testing-library/react'
import { Signup } from '@/presentation/pages'
import React from 'react'

type SutTypes = {
  sut: RenderResult
}
const makeSut = (): SutTypes => {
  const sut = render(
    <Signup/>
  )
  return {
    sut
  }
}
const validateIfElementPropertyHasExpectedValue = (sut: RenderResult, testId: string, property: string, expectedValue: any): void => {
  const element = sut.getByTestId(testId)
  expect(element[property]).toBe(expectedValue)
}

const validateButtonState = (sut: RenderResult, testId: string, isDisabled: boolean): void => {
  const element = sut.getByTestId(testId) as HTMLButtonElement
  expect(element.disabled).toBe(isDisabled)
}
const validateStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  validateIfElementPropertyHasExpectedValue(sut, `${fieldName}-status`, 'title', validationError || 'Tudo certo!')
  validateIfElementPropertyHasExpectedValue(sut, `${fieldName}-status`, 'textContent', validationError ? '🔴' : '🟢')
}
describe('Signup Component', function () {
  test('should Signup Component renders with correct initial state', () => {
    const validationError = 'Campo obrigatório'
    const { sut } = makeSut()
    validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 0)
    validateButtonState(sut, 'submit', true)
    validateStatusForField(sut, 'name', validationError)
    validateStatusForField(sut, 'password', validationError)
    validateStatusForField(sut, 'password', validationError)
    validateStatusForField(sut, 'password', validationError)
  })
})
