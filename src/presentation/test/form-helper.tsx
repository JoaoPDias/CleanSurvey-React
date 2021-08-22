import { fireEvent, RenderResult, waitFor } from '@testing-library/react'
import { Helper } from '@/presentation/test/index'

export const validateIfElementPropertyHasExpectedValue = (sut: RenderResult, testId: string, property: string, expectedValue: any): void => {
  const element = sut.getByTestId(testId)
  expect(element[property]).toBe(expectedValue)
}
export const validateIfElementAttributeHasExpectedValue = (sut: RenderResult, testId: string, attribute: string, expectedValue: any): void => {
  const element = sut.getByTestId(testId)
  expect(element.getAttribute(attribute)).toBe(expectedValue)
}
export const validateButtonState = (sut: RenderResult, testId: string, isDisabled: boolean): void => {
  const element = sut.getByTestId(testId) as HTMLButtonElement
  expect(element.disabled).toBe(isDisabled)
}
export const validateStatusForField = (sut: RenderResult, fieldName: string, validationError: string = ''): void => {
  validateIfElementAttributeHasExpectedValue(sut, `${fieldName}-wrap`, 'data-status', validationError ? 'invalid' : 'valid')
  validateIfElementPropertyHasExpectedValue(sut, `${fieldName}-label`, 'title', validationError)
  validateIfElementPropertyHasExpectedValue(sut, `${fieldName}`, 'title', validationError)
}

export const populateField = (sut: RenderResult, fieldTestId: string, value: string): void => {
  const Input = sut.getByTestId(fieldTestId)
  fireEvent.input(Input, { target: { value: value } })
}

export const simulateValidSubmit = async (sut: RenderResult, fields: Map<string, string>): Promise<void> => {
  fields.forEach((value, key) => {
    Helper.populateField(sut, key, value)
  })
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

export const validateIfElementExists = (sut: RenderResult, testId: string): void => {
  const element = sut.getByTestId(testId)
  expect(element).toBeTruthy()
}
