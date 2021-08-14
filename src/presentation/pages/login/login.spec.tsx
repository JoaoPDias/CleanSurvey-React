import React from 'react'
import * as faker from 'faker'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { Login } from '@/presentation/pages'
import { AuthenticationSpy, SaveAccessTokenMock, ValidationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccessTokenMock
}
const history = createMemoryHistory({ initialEntries: ['/login'] })
const makeSut = (errorMessage: string = null): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = errorMessage
  const authenticationSpy = new AuthenticationSpy()
  const saveAccessTokenMock = new SaveAccessTokenMock()
  const sut = render(
    <Router history={history}>
      <Login validation={validationSpy}
             authentication={authenticationSpy}
             saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )
  return {
    sut,
    validationSpy,
    authenticationSpy,
    saveAccessTokenMock
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
  test('should start with initial state', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 0)
    validateButtonState(sut, 'submit', true)
    validateStatusForField(sut, 'email', validationSpy.errorMessage)
    validateStatusForField(sut, 'password', validationSpy.errorMessage)
  })

  test('should call Email Validation with correct value', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const email = faker.internet.email()
    populateField(sut, 'email', email)
    expect(validationSpy.fieldName).toContain('email')
    expect(validationSpy.fieldValue).toContain(email)
  })
  test('should call Password Validation with correct value', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const password = faker.internet.password()
    populateField(sut, 'password', password)
    expect(validationSpy.fieldName).toContain('password')
    expect(validationSpy.fieldValue).toContain(password)
  })
  test('should show email error if Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    populateField(sut, 'email', faker.internet.email())
    validateStatusForField(sut, 'email', validationSpy.errorMessage)
  })
  test('should show password error if Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    populateField(sut, 'password', faker.internet.password())
    validateStatusForField(sut, 'password', validationSpy.errorMessage)
  })
  test('should show email valid signal if Validation succeeds', () => {
    const { sut } = makeSut()
    populateField(sut, 'email', faker.internet.email())
    validateStatusForField(sut, 'email')
  })
  test('should show password valid signal if Validation succeeds', () => {
    const { sut } = makeSut()
    populateField(sut, 'password', faker.internet.password())
    validateStatusForField(sut, 'password')
  })
  test('should enable submit button if Validation succeeds', () => {
    const { sut } = makeSut()
    populateField(sut, 'email', faker.internet.email())
    populateField(sut, 'password', faker.internet.password())
    validateButtonState(sut, 'submit', false)
  })
  test('should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    validateIfElementExists(sut, 'spinner')
  })
  test('should call Authentication with correct values', async () => {
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
  test('should call Authentication only once', async () => {
    const {
      sut,
      authenticationSpy
    } = makeSut()
    const spy = jest.spyOn(authenticationSpy, 'auth')
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(spy).toBeCalledTimes(1)
  })

  test('should not call Authentication when form is invalid', async () => {
    const {
      sut,
      authenticationSpy
    } = makeSut(faker.random.words())
    const spy = jest.spyOn(authenticationSpy, 'auth')
    await simulateValidSubmit(sut)
    expect(spy).toBeCalledTimes(0)
  })

  test('should present error when Authentication fails', async () => {
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
  test('should call SaveAccessToken when Authentication succeeds', async () => {
    const {
      sut,
      authenticationSpy,
      saveAccessTokenMock
    } = makeSut()
    await simulateValidSubmit(sut)
    expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })
  test('should present error when SaveAccessToken fails', async () => {
    const {
      sut,
      saveAccessTokenMock
    } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(saveAccessTokenMock, 'save').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(sut)
    validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 1)
    validateIfElementPropertyHasExpectedValue(sut, 'main-error', 'textContent', error.message)
  })
  test('should go to signup page', async () => {
    const {
      sut
    } = makeSut()
    const register = sut.getByTestId('signup')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
