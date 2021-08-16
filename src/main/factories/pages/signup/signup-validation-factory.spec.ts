import { ValidationBuilder as Builder, ValidationComposite } from '@/validation/validators'
import { makeSignupValidation } from '@/main/factories/pages/signup/signup-validation-factory'

describe('SignupValidationFactory', function () {
  test('should SignupValidationFactory returns correct validations', () => {
    const composite = makeSignupValidation()
    expect(composite).toEqual(ValidationComposite.build([
      ...Builder.field('name').required().min(5).build(),
      ...Builder.field('email').required().email().build(),
      ...Builder.field('password').required().min(5).build(),
      ...Builder.field('passwordConfirmation').required().min(5).sameAs('password').build()
    ]))
  })
})
