import { fireEvent, RenderResult } from '@testing-library/react'

export const validateIfElementPropertyHasExpectedValue = (sut: RenderResult, testId: string, property: string, expectedValue: any): void => {
  const element = sut.getByTestId(testId)
  expect(element[property]).toBe(expectedValue)
}
export const validateButtonState = (sut: RenderResult, testId: string, isDisabled: boolean): void => {
  const element = sut.getByTestId(testId) as HTMLButtonElement
  expect(element.disabled).toBe(isDisabled)
}
export const validateStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  validateIfElementPropertyHasExpectedValue(sut, `${fieldName}-status`, 'title', validationError || 'Tudo certo!')
  validateIfElementPropertyHasExpectedValue(sut, `${fieldName}-status`, 'textContent', validationError ? '🔴' : '🟢')
}

export const populateField = (sut: RenderResult, fieldTestId: string, value: string): void => {
  const Input = sut.getByTestId(fieldTestId)
  fireEvent.input(Input, { target: { value: value } })
}
