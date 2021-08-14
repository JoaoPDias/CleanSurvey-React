import { RequiredFieldValidation } from '@/validation/validators'
import { RequiredFieldError } from '@/validation/errors'
import * as faker from 'faker'

describe('RequiredFieldValidation', () => {
  const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation(faker.database.column())
  }

  test('should return error when field is empty', () => {
    const sut = makeSut()
    const error = sut.validate('')
    expect(error).toEqual(new RequiredFieldError())
  })
  test('should return falsy when field is not empty', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toBeFalsy()
  })
})
