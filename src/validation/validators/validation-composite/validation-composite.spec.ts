import { ValidationComposite } from '@/validation/validators'
import { FieldValidationSpy } from '@/validation/test'
import * as faker from 'faker'

type SutTypes =
  {
    sut: ValidationComposite
    fieldValidationsSpy: FieldValidationSpy[]
  }

const makeSut = (fieldName: string): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName)
  ]
  const sut = ValidationComposite.build(fieldValidationsSpy)
  return {
    sut,
    fieldValidationsSpy
  }
}
describe('ValidationComposite', function () {
  test('should ValidationComposite returns error when any validation fails', () => {
    const fieldName = faker.database.column()
    const {
      sut,
      fieldValidationsSpy
    } = makeSut(fieldName)
    const errorMessage = faker.random.words()
    fieldValidationsSpy[0].error = new Error(errorMessage)
    const error = sut.validate(fieldName, faker.random.word())
    expect(error).toBe(errorMessage)
  })
  test('should ValidationComposite returns falsy when all validations succeeds', () => {
    const fieldName = faker.database.column()
    const { sut } = makeSut(fieldName)
    const error = sut.validate(fieldName, 'any_value')
    expect(error).toBeFalsy()
  })
})
