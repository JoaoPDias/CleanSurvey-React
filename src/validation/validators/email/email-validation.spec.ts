import { EmailValidation } from '@/validation/validators'
import { InvalidFieldError } from '@/validation/errors'
import * as faker from 'faker'

describe('Email Validation', function () {
  test('should return error if email is invalid', () => {
    const sut = new EmailValidation(faker.random.word())
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError())
  })
  test('should return falsy when email is valid', () => {
    const sut = new EmailValidation(faker.random.word())
    const error = sut.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })
  test('should return falsy when email is empty', () => {
    const sut = new EmailValidation(faker.random.word())
    const error = sut.validate('')
    expect(error).toBeFalsy()
  })
})
