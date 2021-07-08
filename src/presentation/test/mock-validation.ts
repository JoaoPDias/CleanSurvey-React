import { Validation } from '@/presentation/protocols/validation'

export class ValidationSpy implements Validation {
  errorMessage: string
  fieldName: string[] = []
  fieldValue: string[] = []

  validate (fieldName: string, fieldValue: string): string {
    this.fieldName.push(fieldName)
    this.fieldValue.push(fieldValue)
    return this.errorMessage
  }
}
