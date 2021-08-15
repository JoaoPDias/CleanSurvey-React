import React from 'react'
import * as faker from 'faker'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { Login } from '@/presentation/pages'
import { AuthenticationSpy, Helper, SaveAccessTokenMock, ValidationSpy } from '@/presentation/test'
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

describe('Login Component', () => {
  const fields = new Map()
  beforeEach(() => {
    fields.set('email', faker.internet.email())
    fields.set('password', faker.internet.password())
  })
  afterEach(cleanup)
  test('should start with initial state', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    Helper.validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 0)
    Helper.validateButtonState(sut, 'submit', true)
    Helper.validateStatusForField(sut, 'email', validationSpy.errorMessage)
    Helper.validateStatusForField(sut, 'password', validationSpy.errorMessage)
  })

  test('should call Email Validation with correct value', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const email = faker.internet.email()
    Helper.populateField(sut, 'email', email)
    expect(validationSpy.fieldName).toContain('email')
    expect(validationSpy.fieldValue).toContain(email)
  })
  test('should call Password Validation with correct value', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const password = faker.internet.password()
    Helper.populateField(sut, 'password', password)
    expect(validationSpy.fieldName).toContain('password')
    expect(validationSpy.fieldValue).toContain(password)
  })
  test('should show email error if Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    Helper.populateField(sut, 'email', faker.internet.email())
    Helper.validateStatusForField(sut, 'email', validationSpy.errorMessage)
  })
  test('should show password error if Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    Helper.populateField(sut, 'password', faker.internet.password())
    Helper.validateStatusForField(sut, 'password', validationSpy.errorMessage)
  })
  test('should show email valid signal if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'email', faker.internet.email())
    Helper.validateStatusForField(sut, 'email')
  })
  test('should show password valid signal if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'password', faker.internet.password())
    Helper.validateStatusForField(sut, 'password')
  })
  test('should enable submit button if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'email', faker.internet.email())
    Helper.populateField(sut, 'password', faker.internet.password())
    Helper.validateButtonState(sut, 'submit', false)
  })
  test('should show spinner on submit', async () => {
    const { sut } = makeSut()
    await Helper.simulateValidSubmit(sut, fields)
    Helper.validateIfElementExists(sut, 'spinner')
  })
  test('should call Authentication with correct values', async () => {
    const {
      sut,
      authenticationSpy
    } = makeSut()
    const email = fields.get('email')
    const password = fields.get('password')
    await Helper.simulateValidSubmit(sut, fields)
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
    await Helper.simulateValidSubmit(sut, fields)
    await Helper.simulateValidSubmit(sut, fields)
    expect(spy).toBeCalledTimes(1)
  })

  test('should not call Authentication when form is invalid', async () => {
    const {
      sut,
      authenticationSpy
    } = makeSut(faker.random.words())
    const spy = jest.spyOn(authenticationSpy, 'auth')
    await Helper.simulateValidSubmit(sut, fields)
    expect(spy).toBeCalledTimes(0)
  })

  test('should present error when Authentication fails', async () => {
    const {
      sut,
      authenticationSpy
    } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    await Helper.simulateValidSubmit(sut, fields)
    Helper.validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 1)
    Helper.validateIfElementPropertyHasExpectedValue(sut, 'main-error', 'textContent', error.message)
  })
  test('should call SaveAccessToken when Authentication succeeds', async () => {
    const {
      sut,
      authenticationSpy,
      saveAccessTokenMock
    } = makeSut()
    await Helper.simulateValidSubmit(sut, fields)
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
    await Helper.simulateValidSubmit(sut, fields)
    Helper.validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 1)
    Helper.validateIfElementPropertyHasExpectedValue(sut, 'main-error', 'textContent', error.message)
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
