import { EmailValidation } from '@/validation/validators'
import { InvalidFieldError } from '@/validation/errors'
import * as faker from 'faker'

const makeSut = (field: string): EmailValidation => {
  return new EmailValidation(field)
}
describe('Email Validation', function () {
  test('should return error if email is invalid', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toEqual(new InvalidFieldError())
  })
  test('should return falsy when email is valid', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.internet.email() })
    expect(error).toBeFalsy()
  })
  test('should return falsy when email is empty', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: '' })
    expect(error).toBeFalsy()
  })
})
