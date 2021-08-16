import {
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation,
  ValidationBuilder
} from '@/validation/validators'
import { cleanup } from '@testing-library/react'
import * as faker from 'faker'
import { CompareFieldsValidation } from '@/validation/validators/compare-fields/compare-fields-validation'

describe('Validation Builder', function () {
  beforeEach(cleanup)
  test('should Validation Builder returns RequiredFieldValidation', () => {
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field).required().build()
    expect(validations).toContainEqual(new RequiredFieldValidation(field))
  })
  test('should Validation Builder returns EmailValidation', () => {
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field).email().build()
    expect(validations).toContainEqual(new EmailValidation(field))
  })
  test('should Validation Builder returns MinLengthValidation', () => {
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field).min(5).build()
    expect(validations).toContainEqual(new MinLengthValidation(field, 5))
  })
  test('should Validation Builder returns CompareFieldsValidation', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()
    const validations = ValidationBuilder.field(field).sameAs(fieldToCompare).build()
    expect(validations).toContainEqual(new CompareFieldsValidation(field, fieldToCompare))
  })
  test('should Validation Builder returns a list of Validations', () => {
    const field = faker.database.column()
    const length = faker.datatype.number()
    const fieldToCompare = faker.database.column()
    const validations = ValidationBuilder.field(field).required().min(length).email().sameAs(fieldToCompare).build()
    expect(validations).toContainEqual(new MinLengthValidation(field, length))
    expect(validations).toContainEqual(new EmailValidation(field))
    expect(validations).toContainEqual(new RequiredFieldValidation(field))
    expect(validations).toContainEqual(new CompareFieldsValidation(field, fieldToCompare))
  })
})
