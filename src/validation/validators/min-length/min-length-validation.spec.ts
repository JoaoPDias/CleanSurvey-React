import { MinLengthValidation } from '@/validation/validators'
import { InvalidFieldError } from '@/validation/errors'
import * as faker from 'faker'

const makeSut = (minLength: number): MinLengthValidation => new MinLengthValidation(faker.database.column(), minLength)
describe('MinLengthValidation', function () {
  test('Should return error when value is invalid', () => {
    const sut = makeSut(14)
    const error = sut.validate(faker.random.alpha({ count: 13 }))
    expect(error).toEqual(new InvalidFieldError())
  })
  test('Should return falsy when value is valid', () => {
    const sut = makeSut(15)
    const error = sut.validate(faker.random.alpha({ count: 16 }))
    expect(error).toBeFalsy()
  })
})
