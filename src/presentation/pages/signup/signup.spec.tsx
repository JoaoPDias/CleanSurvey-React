import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import { Signup } from '@/presentation/pages'
import React from 'react'
import { AddAccountSpy, Helper, SaveAccessTokenMock, ValidationSpy } from '@/presentation/test'
import faker from 'faker'
import { EmailInUseError } from '@/domain/errors'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  addAccountSpy: AddAccountSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

createMemoryHistory()
const history = createMemoryHistory({ initialEntries: ['/login'] })
const makeSut = (validationError?: string): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addAccountSpy = new AddAccountSpy()
  const saveAccessTokenMock = new SaveAccessTokenMock()
  validationSpy.errorMessage = validationError
  const sut = render(
    <Router history={history}>
      <Signup
        validation={validationSpy}
        addAccount={addAccountSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )
  return {
    sut,
    validationSpy,
    addAccountSpy,
    saveAccessTokenMock
  }
}

const fields = new Map()
describe('Signup Component', function () {
  beforeEach(() => {
    const password = faker.internet.password()
    fields.set('name', faker.name.findName())
    fields.set('email', faker.internet.email())
    fields.set('password', password)
    fields.set('passwordConfirmation', password)
  })
  afterEach(cleanup)
  test('should Signup Component render with correct initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut(validationError)
    Helper.validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 0)
    Helper.validateButtonState(sut, 'submit', true)
    Helper.validateStatusForField(sut, 'name', validationError)
    Helper.validateStatusForField(sut, 'email', validationError)
    Helper.validateStatusForField(sut, 'password', validationError)
    Helper.validateStatusForField(sut, 'passwordConfirmation', validationError)
  })

  test('should Signup Component show name error when Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    Helper.populateField(sut, 'name', faker.name.findName())
    Helper.validateStatusForField(sut, 'name', validationSpy.errorMessage)
  })

  test('should Signup Component call Name Validation with correct value', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const name = faker.internet.userName()
    Helper.populateField(sut, 'name', name)
    expect(validationSpy.fieldName).toContain('name')
    expect(validationSpy.fieldValue).toContain(name)
  })

  test('should Signup Component show email error when Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    Helper.populateField(sut, 'email', faker.internet.email())
    Helper.validateStatusForField(sut, 'email', validationSpy.errorMessage)
  })

  test('should Signup Component call Email Validation with correct value', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const email = faker.internet.email()
    Helper.populateField(sut, 'email', email)
    expect(validationSpy.fieldName).toContain('email')
    expect(validationSpy.fieldValue).toContain(email)
  })

  test('should Signup Component call Password Validation with correct value', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const password = faker.internet.password()
    Helper.populateField(sut, 'password', password)
    expect(validationSpy.fieldName).toContain('password')
    expect(validationSpy.fieldValue).toContainEqual(password)
  })

  test('should Signup Component show password error when Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    Helper.populateField(sut, 'password', faker.internet.password())
    Helper.validateStatusForField(sut, 'password', validationSpy.errorMessage)
  })

  test('should Signup Component call PasswordConfirmation Validation with correct value', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    const password = faker.internet.password()
    Helper.populateField(sut, 'passwordConfirmation', password)
    expect(validationSpy.fieldName).toContain('passwordConfirmation')
    expect(validationSpy.fieldValue).toContain(password)
  })

  test('should Signup Component show passwordConfirmation error when Validation fails', () => {
    const {
      sut,
      validationSpy
    } = makeSut(faker.random.words())
    Helper.populateField(sut, 'passwordConfirmation', faker.internet.password())
    Helper.validateStatusForField(sut, 'passwordConfirmation', validationSpy.errorMessage)
  })

  test('should Signup Component show name valid signal when Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'name', faker.name.findName())
    Helper.validateStatusForField(sut, 'name')
  })

  test('should Signup Component show email valid signal when Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'email', faker.internet.email())
    Helper.validateStatusForField(sut, 'email')
  })

  test('should Signup Component show password valid signal when Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'password', faker.internet.password())
    Helper.validateStatusForField(sut, 'password')
  })

  test('should Signup Component show passwordConfirmation valid signal when Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'passwordConfirmation', faker.internet.password())
    Helper.validateStatusForField(sut, 'passwordConfirmation')
  })
  test('should Signup Component enable submit button if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'name', fields.get('name'))
    Helper.populateField(sut, 'email', fields.get('email'))
    Helper.populateField(sut, 'password', fields.get('password'))
    Helper.populateField(sut, 'passwordConfirmation', fields.get('passwordConfirmation'))
    Helper.validateButtonState(sut, 'submit', false)
  })

  test('should Signup Component show spinner on submit', async () => {
    const { sut } = makeSut()
    await Helper.simulateValidSubmit(sut, fields)
    Helper.validateIfElementExists(sut, 'spinner')
  })

  test('should Signup Component call AddAccount with correct values', async () => {
    const {
      sut,
      addAccountSpy
    } = makeSut()
    const name = fields.get('name')
    const email = fields.get('email')
    const password = fields.get('password')
    const passwordConfirmation = fields.get('passwordConfirmation')

    Helper.populateField(sut, 'name', name)
    Helper.populateField(sut, 'email', email)
    Helper.populateField(sut, 'password', password)
    Helper.populateField(sut, 'passwordConfirmation', passwordConfirmation)
    await Helper.simulateValidSubmit(sut, fields)

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation
    })
  })

  test('should Signup Component call AddAccount only once', async () => {
    const {
      sut,
      addAccountSpy
    } = makeSut()
    const spy = jest.spyOn(addAccountSpy, 'add')
    await Helper.simulateValidSubmit(sut, fields)
    await Helper.simulateValidSubmit(sut, fields)
    expect(spy).toBeCalledTimes(1)
  })

  test('should Signup Component not call AddAccount when form is invalid', async () => {
    const {
      sut,
      addAccountSpy
    } = makeSut(faker.random.words())
    const spy = jest.spyOn(addAccountSpy, 'add')
    await Helper.simulateValidSubmit(sut, fields)
    expect(spy).toBeCalledTimes(0)
  })

  test('should Signup Component present error when AddAccount fails', async () => {
    const {
      sut,
      addAccountSpy
    } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockReturnValueOnce(Promise.reject(error))
    await Helper.simulateValidSubmit(sut, fields)
    Helper.validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 1)
    Helper.validateIfElementPropertyHasExpectedValue(sut, 'main-error', 'textContent', error.message)
  })

  test('should Signup Component call SaveAccessToken when AddAccount succeeds', async () => {
    const {
      sut,
      addAccountSpy,
      saveAccessTokenMock
    } = makeSut()
    await Helper.simulateValidSubmit(sut, fields)
    expect(saveAccessTokenMock.accessToken).toBe(addAccountSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should Signup Component present error when SaveAccessToken fails', async () => {
    const {
      sut,
      saveAccessTokenMock
    } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(saveAccessTokenMock, 'save').mockReturnValueOnce(Promise.reject(error))
    await Helper.simulateValidSubmit(sut, fields)
    Helper.validateIfElementPropertyHasExpectedValue(sut, 'errorWrap', 'childElementCount', 1)
    Helper.validateIfElementPropertyHasExpectedValue(sut, 'main-error', 'textContent', error.message)
  })
  test('should Signup Component redirect to login page when click in Login Button', async () => {
    const {
      sut
    } = makeSut()
    const login = sut.getByTestId('login-link')
    fireEvent.click(login)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/login')
  })
})
