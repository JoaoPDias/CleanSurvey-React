import faker from 'faker'

const baseUrl: string = Cypress.config().baseUrl
describe('Signup', function () {
  beforeEach(() => {
    cy.visit('signup')
  })
  it('should Signup Page load with correct initial state', () => {
    cy.getByTestId('name').should('have.attr', 'readonly')
    cy.shouldInputStatusBeInvalid('name', 'Campo Obrigatório')

    cy.getByTestId('email').should('have.attr', 'readonly')
    cy.shouldInputStatusBeInvalid('email', 'Campo Obrigatório')

    cy.getByTestId('password').should('have.attr', 'readonly')
    cy.shouldInputStatusBeInvalid('password', 'Campo Obrigatório')

    cy.getByTestId('passwordConfirmation').should('have.attr', 'readonly')
    cy.shouldInputStatusBeInvalid('passwordConfirmation', 'Campo Obrigatório')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Signup Page show error when form is invalid', () => {
    cy.signup(faker.random.alphaNumeric(3), faker.random.alphaNumeric(3), faker.random.alphaNumeric(3), faker.random.alphaNumeric(3))
    cy.shouldInputStatusBeInvalid('name', 'Valor Inválido')
    cy.shouldInputStatusBeInvalid('email', 'Valor Inválido')
    cy.shouldInputStatusBeInvalid('password', 'Valor Inválido')
    cy.shouldInputStatusBeInvalid('passwordConfirmation', 'Valor Inválido')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Signup Page show valid state when form is valid', () => {
    const password = faker.random.alphaNumeric(15)
    cy.signup(faker.name.findName(), faker.internet.email(), password, password)
    cy.shouldInputStatusBeValid('name')
    cy.shouldInputStatusBeValid('email')
    cy.shouldInputStatusBeValid('password')
    cy.shouldInputStatusBeValid('passwordConfirmation')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Signup Page show error when password and passwordConfirmation are different', () => {
    cy.signup(faker.name.findName(), faker.internet.email(), faker.random.alphaNumeric(15), faker.random.alphaNumeric(15))
    cy.shouldInputStatusBeValid('name')
    cy.shouldInputStatusBeValid('email')
    cy.shouldInputStatusBeValid('password')
    cy.shouldInputStatusBeInvalid('passwordConfirmation', 'Valor diferente do esperado.')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Signup Page show EmailInUseError message when email already is registered', () => {
    cy.mockForbiddenError(/signup/, 'POST')
    const password = faker.random.alphaNumeric(15)
    cy.signup(faker.name.findName(), faker.internet.email(), password, password)
    cy.getByTestId('submit').click()
    cy.validateMainError('Esse e-mail já está em uso')
    cy.url().should('eq', `${baseUrl}/signup`)
    cy.shouldLocalStorageItemNotExist('accessToken')
  })
  it('should Signup Page show UnexpectedError message when Status code is between 402 and 500', () => {
    cy.mockUnexpectedError(/signup/, 'POST')
    const password = faker.random.alphaNumeric(15)
    cy.signup(faker.name.findName(), faker.internet.email(), password, password)
    cy.getByTestId('submit').click()
    cy.validateMainError('Algo de errado aconteceu. Aguarde um momento para poder executar a funcionalidade')
    cy.url().should('eq', `${baseUrl}/signup`)
    cy.shouldLocalStorageItemNotExist('accessToken')
  })
  it('should Signup Page change to Main Page when Credentials are valid', () => {
    cy.mockOk(/signup/, 'POST', { accessToken: faker.datatype.uuid() })
    const password = faker.random.alphaNumeric(15)
    cy.signup(faker.name.findName(), faker.internet.email(), password, password)
    cy.getByTestId('submit').click()
    cy.getByTestId('main-error').should('not.exist')
    cy.getByTestId('spinner').should('not.exist')
    cy.url().should('eq', `${baseUrl}/`)
    cy.shouldLocalStorageItemExist('accessToken')
  })
  it('should Signup Page show UnexpectedError when accessToken was not returned', () => {
    cy.mockOk(/signup/, 'POST', { invalidProperty: faker.datatype.uuid() })
    const password = faker.random.alphaNumeric(15)
    cy.signup(faker.name.findName(), faker.internet.email(), password, password)
    cy.getByTestId('submit').click()
    cy.getByTestId('main-error').should('exist')
    cy.validateMainError('Algo de errado aconteceu. Aguarde um momento para poder executar a funcionalidade')
    cy.url().should('eq', `${baseUrl}/signup`)
    cy.shouldLocalStorageItemNotExist('accessToken')
  })
  it('should Signup Page prevent multiple submits', () => {
    cy.mockOk(/signup/, 'POST', { accessToken: faker.datatype.uuid() }).as('loginRequest')
    const password = faker.random.alphaNumeric(15)
    cy.signup(faker.name.findName(), faker.internet.email(), password, password)
    cy.getByTestId('submit').dblclick()
    cy.get('@loginRequest.all').should('have.length', 1)
  })
  it('should Signup Page change to Main Page when Credentials are valid and enter was pressed', () => {
    cy.mockOk(/signup/, 'POST', { accessToken: faker.datatype.uuid() })
    const password = faker.random.alphaNumeric(15)
    cy.signup(faker.name.findName(), faker.internet.email(), password, password)
      .type('{enter}')
    cy.getByTestId('main-error').should('not.exist')
    cy.getByTestId('spinner').should('not.exist')
    cy.url().should('eq', `${baseUrl}/`)
    cy.shouldLocalStorageItemExist('accessToken')
  })
  it('should Signup Page prevent submit when form is invalid and user pressed Enter', () => {
    cy.mockOk(/signup/, 'POST', { accessToken: faker.datatype.uuid() }).as('loginRequest')
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    cy.get('@loginRequest.all').should('have.length', 0)
  })
})
