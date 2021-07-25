import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite'
import { FieldValidationSpy } from '@/validation/validators/test/mock-field-validation'

type SutTypes =
  {
    sut: ValidationComposite
    fieldValidationsSpy: FieldValidationSpy[]
  }

const makeSut = (): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy('any_field'),
    new FieldValidationSpy('any_field')
  ]
  const sut = new ValidationComposite(fieldValidationsSpy)
  return {
    sut,
    fieldValidationsSpy
  }
}
describe('ValidationComposite', function () {
  test('Should ValidationComposite returns error when any validation fails', () => {
    const {
      sut,
      fieldValidationsSpy
    } = makeSut()
    fieldValidationsSpy[0].error = new Error('first_error_message')
    const error = sut.validate('any_field', 'any_value')
    expect(error).toBe('first_error_message')
  })
  test('Should ValidationComposite returns falsy when all validations succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate('any_field', 'any_value')
    expect(error).toBeFalsy()
  })
})
