import { RequiredFieldValidation } from '@/validation/validators/required-field/required-field-validation'
import { RequiredFieldError } from '@/validation/errors'
import * as faker from 'faker'

describe('RequiredFieldValidation', () => {
  const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation(faker.database.column())
  }

  test('Should return error when field is empty', () => {
    const sut = makeSut()
    const error = sut.validate('')
    expect(error).toEqual(new RequiredFieldError())
  })
  test('Should return falsy when field is not empty', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toBeFalsy()
  })
})
