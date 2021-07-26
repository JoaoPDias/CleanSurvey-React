import { RequiredFieldValidation, ValidationBuilder } from '@/validation/validators'

describe('Validation Builder', function () {
  test('Should Validation Builder return RequiredFieldValidation', () => {
    const validations = ValidationBuilder.field('any_field').required().build()
    expect(validations).toContainEqual(new RequiredFieldValidation('any_field'))
  })
  test('Should Validation Builder return RequiredFieldValidation', () => {
    const validations = ValidationBuilder.field('any_field').email().build()
    expect(validations).toContainEqual(new RequiredFieldValidation('any_field'))
  })
})
