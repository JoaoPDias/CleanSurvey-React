import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite'
import { FieldValidationSpy } from '@/validation/validators/test/mock-field-validation'

describe('ValidationComposite', function () {
  test('Should ValidationComposite return error when any validation fails', () => {
    const fieldValidationSpySuccess = new FieldValidationSpy('any_field')
    const fieldValidationSpyError = new FieldValidationSpy('any_field')
    fieldValidationSpyError.error = new Error('any_error_message')
    const sut = new ValidationComposite([
      fieldValidationSpySuccess,
      fieldValidationSpyError
    ])
    const error = sut.validate('any_field', 'any_value')
    expect(error).toBe('any_error_message')
  })
})
