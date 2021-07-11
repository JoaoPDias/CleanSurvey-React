import React from 'react'
import * as faker from 'faker'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import 'jest-localstorage-mock'
import { Login } from '@/presentation/pages'
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}
const history = createMemoryHistory({ initialEntries: ['/login'] })
const makeSut = (errorMessage: string = null): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = errorMessage
  const authenticationSpy = new AuthenticationSpy()
  const sut = render(
    <Router history={history}>
      <Login validation={validationSpy} authentication={authenticationSpy}/>
    </Router>
  )
  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

const simulateValidSubmit = async (sut: RenderResult, email: string = faker.internet.email(), password: string = faker.internet.password()): Promise<void> => {
  populateField(sut, 'email', email)
  populateField(sut, 'password', password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

const populateField = (sut: RenderResult, fieldTestId: string, value: string): void => {
  const Input = sut.getByTestId(fieldTestId)
  fireEvent.input(Input, { target: { value: value } })
}

const validateStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  validateIfElementPropertyHasExpectedValue(sut, `${fieldName}-status`, 'title', validationError || 'Tudo certo!')
  validateIfElementPropertyHasExpectedValue(sut, `${fieldName}-status`, 'textContent', validationError ? '🔴' : '🟢')
}
const validateIfElementExists = (sut: RenderResult, testId: string): void => {
  const element = sut.getByTestId(testId)
  expect(element).toBeTruthy()
}
const validateIfElementPropertyHasExpectedValue = (sut: RenderResult, testId: string, property: string, expectedValue: any): void => {
  const element = sut.getByTestId(testId)
  expect(element[property]).toBe(expectedValue)
}
const validateButtonState = (sut: RenderResult, testId: string, isDisabled: boolean): void => {
  const element = sut.getByTestId(testId) as HTMLButtonElement
  expect(element.disabled).toBe(isDisabled)
}
describe('Login Component', () => {
  afterEach(cleanup)
  beforeEach(() => {
    localStorage.clear()
  })
  test('Should start with inital state', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 0)
    validateButtonState(sut, 'submit', true)
    validateStatusForField(sut, 'email', validationSpy.errorMessage)
    validateStatusForField(sut, 'password', validationSpy.errorMessage)
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
    validateStatusForField(sut, 'email', validationSpy.errorMessage)
  })
  test('Should show password error if Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    populateField(sut, 'password', faker.internet.password())
    validateStatusForField(sut, 'password', validationSpy.errorMessage)
  })
  test('Should show email valid signal if Validation succeeds', () => {
    const { sut } = makeSut()
    populateField(sut, 'email', faker.internet.email())
    validateStatusForField(sut, 'email')
  })
  test('Should show password valid signal if Validation succeeds', () => {
    const { sut } = makeSut()
    populateField(sut, 'password', faker.internet.password())
    validateStatusForField(sut, 'password')
  })
  test('Should enable submit button if Validation succeeds', () => {
    const { sut } = makeSut()
    populateField(sut, 'email', faker.internet.email())
    populateField(sut, 'password', faker.internet.password())
    validateButtonState(sut, 'submit', false)
  })
  test('Should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    validateIfElementExists(sut, 'spinner')
  })
  test('Should call Authentication with correct values', async () => {
    const {
      sut,
      authenticationSpy
    } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
  test('Should call Authentication only once', async () => {
    const {
      sut,
      authenticationSpy
    } = makeSut()
    const spy = jest.spyOn(authenticationSpy, 'auth')
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(spy).toBeCalledTimes(1)
  })

  test('Should not call Authentication when form is invalid', async () => {
    const {
      sut,
      authenticationSpy
    } = makeSut(faker.random.words())
    const spy = jest.spyOn(authenticationSpy, 'auth')
    await simulateValidSubmit(sut)
    expect(spy).toBeCalledTimes(0)
  })

  test('Should present error when Authentication fails', async () => {
    const {
      sut,
      authenticationSpy
    } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(sut)
    validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 1)
    validateIfElementPropertyHasExpectedValue(sut, 'main-error', 'textContent', error.message)
  })
  test('Should add Access Token in Local Storage when Authentication succeeds', async () => {
    const {
      sut,
      authenticationSpy
    } = makeSut()
    await simulateValidSubmit(sut)
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })
  test('Should go to signup page', async () => {
    const {
      sut
    } = makeSut()
    const register = sut.getByTestId('signup')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
