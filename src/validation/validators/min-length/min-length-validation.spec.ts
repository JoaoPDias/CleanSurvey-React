import { MinLengthValidation } from '@/validation/validators'
import { InvalidFieldError } from '@/validation/errors'
import * as faker from 'faker'

const makeSut = (field: string, minLength: number): MinLengthValidation => new MinLengthValidation(field, minLength)
describe('MinLengthValidation', function () {
  test('should return error when value is invalid', () => {
    const field = faker.database.column()
    const sut = makeSut(field, 14)
    const error = sut.validate({ [field]: faker.random.alpha({ count: 13 }) })
    expect(error).toEqual(new InvalidFieldError())
  })
  test('should return falsy when value is valid', () => {
    const field = faker.database.column()
    const sut = makeSut(field, 15)
    const error = sut.validate({ [field]: faker.random.alpha({ count: 16 }) })
    expect(error).toBeFalsy()
  })
  test('should return falsy when field does not exist in schema', () => {
    const field = faker.database.column()
    const sut = makeSut(field, 15)
    const error = sut.validate({ [faker.database.column()]: faker.random.alpha({ count: 16 }) })
    expect(error).toBeFalsy()
  })
})
