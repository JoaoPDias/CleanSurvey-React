import React from 'react'
import * as faker from 'faker'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (errorMessage: string = null): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = errorMessage
  const authenticationSpy = new AuthenticationSpy()
  const sut = render(<Login validation={validationSpy} authentication={authenticationSpy}/>)
  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

const simulateValidSubmit = (sut: RenderResult, email: string = faker.internet.email(), password: string = faker.internet.password()): void => {
  populateField(sut, 'email', email)
  populateField(sut, 'password', password)
  const submitButton = sut.getByTestId('submit')
  fireEvent.click(submitButton)
}

const populateField = (sut: RenderResult, fieldTestId: string, value: string): void => {
  const Input = sut.getByTestId(fieldTestId)
  fireEvent.input(Input, { target: { value: value } })
}

const simulateStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}
describe('Login Component', () => {
  afterEach(cleanup)
  test('Should start with inital state', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const errorWrap = sut.getByTestId('errorWrap')
    expect(errorWrap.childElementCount).toBe(0)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeTruthy()
    simulateStatusForField(sut, 'email', validationSpy.errorMessage)
    simulateStatusForField(sut, 'password', validationSpy.errorMessage)
  })

  test('Should call Email Validation with correct value', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const email = faker.internet.email()
    populateField(sut, 'email', email)
    expect(validationSpy.fieldName).toContain('email')
    expect(validationSpy.fieldValue).toContain(email)
  })
  test('Should call Password Validation with correct value', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const password = faker.internet.password()
    populateField(sut, 'password', password)
    expect(validationSpy.fieldName).toContain('password')
    expect(validationSpy.fieldValue).toContain(password)
  })
  test('Should show email error if Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    populateField(sut, 'email', faker.internet.email())
    simulateStatusForField(sut, 'email', validationSpy.errorMessage)
  })
  test('Should show password error if Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    populateField(sut, 'password', faker.internet.password())
    simulateStatusForField(sut, 'password', validationSpy.errorMessage)
  })
  test('Should show email valid signal if Validation succeeds', () => {
    const { sut } = makeSut()
    populateField(sut, 'email', faker.internet.email())
    simulateStatusForField(sut, 'email')
  })
  test('Should show password valid signal if Validation succeeds', () => {
    const { sut } = makeSut()
    populateField(sut, 'password', faker.internet.password())
    simulateStatusForField(sut, 'password')
  })
  test('Should enable submit button if Validation succeeds', () => {
    const { sut } = makeSut()
    populateField(sut, 'email', faker.internet.email())
    populateField(sut, 'password', faker.internet.password())
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeFalsy()
  })
  test('Should show spinner on submit', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)
    const errorWrap = sut.getByTestId('errorWrap')
    expect(errorWrap.childElementCount).toBe(1)
  })
  test('Should call Authentication with correct values', () => {
    const {
      sut,
      authenticationSpy
    } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
  test('Should call Authentication only once', () => {
    const {
      sut,
      authenticationSpy
    } = makeSut()
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication when form is invalid', () => {
    const {
      sut,
      authenticationSpy
    } = makeSut(faker.random.words())
    populateField(sut, 'email', faker.internet.email())
    fireEvent.submit(sut.getByTestId('form'))
    expect(authenticationSpy.callsCount).toBe(0)
  })
})
