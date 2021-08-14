import { InvalidFieldError } from '@/validation/errors'
import * as faker from 'faker'
import { CompareFieldsValidation } from '@/validation/validators/compare-fields/compare-fields-validation'

const makeSut = (valueToCompare: string): CompareFieldsValidation => new CompareFieldsValidation(faker.database.column(), valueToCompare)
describe('CompareFieldsValidation', function () {
  test('should CompareFieldsValidation returns error when field values are different', () => {
    const sut = makeSut(faker.random.word())
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError())
  })
})
