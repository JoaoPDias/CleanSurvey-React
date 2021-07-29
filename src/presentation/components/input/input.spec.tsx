import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { Input } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'

describe('Input Component', function () {
  test('Should Input Component begins with readonly', () => {
    const { getByTestId } = render(
      <Context.Provider value={{ state: {} }}>
        <Input name="field"/>)
      </Context.Provider>)
    const input = getByTestId('field') as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })
  test('Should Input Component on focus be enable', () => {
    const { getByTestId } = render(
      <Context.Provider value={{ state: {} }}>
        <Input name="field"/>)
      </Context.Provider>)
    const input = getByTestId('field') as HTMLInputElement
    fireEvent.focus(input)
    expect(input.readOnly).toBe(false)
  })
})
