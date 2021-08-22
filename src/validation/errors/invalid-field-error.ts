export class InvalidFieldError extends Error {
  constructor (message: string = 'Valor Inválido') {
    super(message)
  }
}
