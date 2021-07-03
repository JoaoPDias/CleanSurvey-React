export class UnexpectedError extends Error {
  constructor () {
    super('Algo de errado aconteceu. Aguarde um momento para poder executar a funcionalidade')
    this.name = 'UnexpectedError'
  }
}
