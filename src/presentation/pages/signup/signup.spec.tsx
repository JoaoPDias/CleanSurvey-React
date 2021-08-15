import { render, RenderResult } from '@testing-library/react'
import { Signup } from '@/presentation/pages'
import React from 'react'
import { Helper } from '@/presentation/test'

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

describe('Signup Component', function () {
  test('should Signup Component renders with correct initial state', () => {
    const validationError = 'Campo obrigatório'
    const { sut } = makeSut()
    Helper.validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 0)
    Helper.validateButtonState(sut, 'submit', true)
    Helper.validateStatusForField(sut, 'name', validationError)
    Helper.validateStatusForField(sut, 'password', validationError)
    Helper.validateStatusForField(sut, 'password', validationError)
    Helper.validateStatusForField(sut, 'password', validationError)
  })
})
