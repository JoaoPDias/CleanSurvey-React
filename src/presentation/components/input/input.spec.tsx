import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { Input } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import '@testing-library/jest-dom'
describe('Input Component', function () {
  test('should Input Component begins with readonly', () => {
    const { getByTestId } = render(
      <Context.Provider value={{ state: {} }}>
        <Input name="field"/>)
      </Context.Provider>)
    const input = getByTestId('field') as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })
  test('should Input Component on focus be enable', () => {
    const { getByTestId } = render(
      <Context.Provider value={{ state: {} }}>
        <Input name="field"/>)
      </Context.Provider>)
    const input = getByTestId('field') as HTMLInputElement
    fireEvent.focus(input)
    expect(input.readOnly).toBe(false)
  })
  test('should Input element be focused when click in Label', () => {
    const { getByTestId } = render(
      <Context.Provider value={{ state: {} }}>
        <Input name="field"/>)
      </Context.Provider>)
    const label = getByTestId('field-label') as HTMLInputElement
    const input = getByTestId('field') as HTMLInputElement
    fireEvent.click(label)
    expect(input).toHaveFocus()
  })
})
