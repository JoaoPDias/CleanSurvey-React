import {
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation, ValidationBuilder
} from '@/validation/validators'
import { cleanup } from '@testing-library/react'
import * as faker from 'faker'

describe('Validation Builder', function () {
  beforeEach(cleanup)
  test('Should Validation Builder returns RequiredFieldValidation', () => {
    const validations = ValidationBuilder.field('any_field').required().build()
    expect(validations).toContainEqual(new RequiredFieldValidation('any_field'))
  })
  test('Should Validation Builder returns EmailValidation', () => {
    const validations = ValidationBuilder.field('any_field').email().build()
    expect(validations).toContainEqual(new EmailValidation('any_field'))
  })
  test('Should Validation Builder returns MinLengthValidation', () => {
    const validations = ValidationBuilder.field('any_field').min(5).build()
    expect(validations).toContainEqual(new MinLengthValidation('any_field', 5))
  })
  test('Should Validation Builder returns a list of Validations', () => {
    const field = faker.database.column()
    const length = faker.datatype.number()
    const validations = ValidationBuilder.field(field).required().min(length).email().build()
    expect(validations).toContainEqual(new MinLengthValidation(field, length))
    expect(validations).toContainEqual(new EmailValidation(field))
    expect(validations).toContainEqual(new RequiredFieldValidation(field))
  })
})
