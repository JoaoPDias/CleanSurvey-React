
import * as faker from 'faker'
import { EmailValidation } from '@/validation/validators'
import { InvalidFieldError } from '@/validation/errors'

describe('Email Validation', function () {
  test('Should return error if email is invalid', () => {
    const sut = new EmailValidation(faker.random.word())
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError())
  })
  test('Should return falsy when email is valid', () => {
    const sut = new EmailValidation(faker.random.word())
    const error = sut.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })
  test('Should return falsy when email is empty', () => {
    const sut = new EmailValidation(faker.random.word())
    const error = sut.validate('')
    expect(error).toBeFalsy()
  })
})
