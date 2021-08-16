import { RequiredFieldValidation } from '@/validation/validators'
import { RequiredFieldError } from '@/validation/errors'
import * as faker from 'faker'

describe('RequiredFieldValidation', () => {
  const makeSut = (field: string): RequiredFieldValidation => {
    return new RequiredFieldValidation(field)
  }

  test('should return error when field is empty', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: '' })
    expect(error).toEqual(new RequiredFieldError())
  })
  test('should return falsy when field is not empty', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
