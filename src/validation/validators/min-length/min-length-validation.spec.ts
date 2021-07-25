import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from '@/validation/validators/min-length/min-length-validation'
import * as faker from 'faker'

describe('MinLengthValidation', function () {
  test('Should return error when value is invalid', () => {
    const sut = new MinLengthValidation('field', 14)
    const error = sut.validate(faker.random.alpha({ count: 13 }))
    expect(error).toEqual(new InvalidFieldError())
  })
  test('Should return falsy when value is valid', () => {
    const sut = new MinLengthValidation('field', 15)
    const error = sut.validate(faker.random.alpha({ count: 16 }))
    expect(error).toBeFalsy()
  })
})
