import { InvalidFieldError } from '@/validation/errors'
import * as faker from 'faker'
import { CompareFieldsValidation } from '@/validation/validators/compare-fields/compare-fields-validation'

const makeSut = (field: string, fieldToCompare: string): CompareFieldsValidation => new CompareFieldsValidation(field, fieldToCompare)
describe('CompareFieldsValidation', function () {
  test('should CompareFieldsValidation returns error when field values are different', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()
    const sut = makeSut(field, fieldToCompare)
    const error = sut.validate({
      [field]: faker.random.word(),
      [fieldToCompare]: faker.random.word()
    })
    expect(error).toEqual(new InvalidFieldError('Valor diferente do esperado.'))
  })

  test('should CompareFieldsValidation returns falsy when fields values are equal', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()
    const value = faker.random.word()
    const sut = makeSut(field, fieldToCompare)
    const error = sut.validate({
      [fieldToCompare]: value,
      [field]: value
    })
    expect(error).toBeFalsy()
  })
})
