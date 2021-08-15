import { cleanup, render, RenderResult } from '@testing-library/react'
import { Signup } from '@/presentation/pages'
import React from 'react'
import { Helper, ValidationSpy } from '@/presentation/test'
import faker from 'faker'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}
const makeSut = (validationError?: string): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = validationError
  const sut = render(
    <Signup validation={validationSpy}/>
  )
  return {
    sut,
    validationSpy
  }
}

describe('Signup Component', function () {
  afterEach(cleanup)
  test('should Signup Component renders with correct initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut(validationError)
    Helper.validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 0)
    Helper.validateButtonState(sut, 'submit', true)
    Helper.validateStatusForField(sut, 'name', validationError)
    Helper.validateStatusForField(sut, 'email', validationError)
    Helper.validateStatusForField(sut, 'password', 'Campo obrigatório')
    Helper.validateStatusForField(sut, 'passwordConfirmation', 'Campo obrigatório')
  })

  test('should Signup Component shows name error when Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    Helper.populateField(sut, 'name', faker.internet.email())
    Helper.validateStatusForField(sut, 'name', validationSpy.errorMessage)
  })

  test('should Signup Component calls Name Validation with correct value', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const name = faker.internet.userName()
    Helper.populateField(sut, 'name', name)
    expect(validationSpy.fieldName).toContain('name')
    expect(validationSpy.fieldValue).toContain(name)
  })

  test('should Signup Component shows email error when Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    Helper.populateField(sut, 'email', faker.internet.email())
    Helper.validateStatusForField(sut, 'email', validationSpy.errorMessage)
  })

  test('should Signup Component calls Email Validation with correct value', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const email = faker.internet.email()
    Helper.populateField(sut, 'email', email)
    expect(validationSpy.fieldName).toContain('email')
    expect(validationSpy.fieldValue).toContain(email)
  })
})
