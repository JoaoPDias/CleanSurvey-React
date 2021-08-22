import * as faker from 'faker'

const baseUrl: string = Cypress.config().baseUrl
describe('Login', function () {
  beforeEach(() => {
    cy.visit('login')
  })
  it('should Login Page load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readonly')
    cy.validateErrorInputStatus('email', 'Campo Obrigatório')

    cy.getByTestId('password').should('have.attr', 'readonly')
    cy.validateErrorInputStatus('password', 'Campo Obrigatório')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Login Page show error when form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.words(3))
    cy.validateErrorInputStatus('email', 'Valor Inválido')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    cy.validateErrorInputStatus('password', 'Valor Inválido')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Login Page show valid message when form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.validateSuccessInputStatus('email')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.validateSuccessInputStatus('password')

    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Login Page show InvalidCredentialsError message when Credentials are invalid', () => {
    cy.mockInvalidCredentialsError(/login/, 'POST')
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.validateMainError('Credenciais inválidas')
    cy.url().should('eq', `${baseUrl}/login`)
    cy.shouldLocalStorageItemNotExist('accessToken')
  })
  it('should Login Page show UnexpectedError message when Status code is between 402 and 500', () => {
    cy.mockUnexpectedError(/login/, 'POST')
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.validateMainError('Algo de errado aconteceu. Aguarde um momento para poder executar a funcionalidade')
    cy.url().should('eq', `${baseUrl}/login`)
    cy.shouldLocalStorageItemNotExist('accessToken')
  })
  it('should Login Page change to Main Page when Credentials are valid', () => {
    cy.mockOk(/login/, 'POST', { accessToken: faker.datatype.uuid() })
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('main-error').should('not.exist')
    cy.getByTestId('spinner').should('not.exist')
    cy.url().should('eq', `${baseUrl}/`)
    cy.shouldLocalStorageItemExist('accessToken')
  })
  it('should Login Page show UnexpectedError when accessToken was not returned', () => {
    cy.mockOk(/login/, 'POST', { invalidProperty: faker.datatype.uuid() })
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('main-error').should('exist')
    cy.validateMainError('Algo de errado aconteceu. Aguarde um momento para poder executar a funcionalidade')
    cy.url().should('eq', `${baseUrl}/login`)
    cy.shouldLocalStorageItemNotExist('accessToken')
  })
  it('should Login Page prevent multiple submits', () => {
    cy.mockOk(/login/, 'POST', { accessToken: faker.datatype.uuid() }).as('loginRequest')
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').dblclick()
    cy.get('@loginRequest.all').should('have.length', 1)
  })
  it('should Login Page change to Main Page when Credentials are valid and enter was pressed', () => {
    cy.mockOk(/login/, 'POST', { accessToken: faker.datatype.uuid() })
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5)).type('{enter}')
    cy.getByTestId('main-error').should('not.exist')
    cy.getByTestId('spinner').should('not.exist')
    cy.url().should('eq', `${baseUrl}/`)
    cy.shouldLocalStorageItemExist('accessToken')
  })
  it('should Login Page prevent submit when form is invalid and user pressed Enter', () => {
    cy.mockOk(/login/, 'POST', { accessToken: faker.datatype.uuid() }).as('loginRequest')
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    cy.get('@loginRequest.all').should('have.length', 0)
  })
})
