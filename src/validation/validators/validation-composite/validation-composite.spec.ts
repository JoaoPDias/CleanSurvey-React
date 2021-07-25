import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite'
import { FieldValidationSpy } from '@/validation/validators/test/mock-field-validation'

describe('ValidationComposite', function () {
  test('Should ValidationComposite return error when any validation fails', () => {
    const fieldValidationSpyError = new FieldValidationSpy('any_field')
    fieldValidationSpyError.error = new Error('first_error_message')
    const fieldValidationSpySuccess = new FieldValidationSpy('any_field')
    const sut = new ValidationComposite([
      fieldValidationSpyError,
      fieldValidationSpySuccess
    ])
    const error = sut.validate('any_field', 'any_value')
    expect(error).toBe('first_error_message')
  })
})
