import * as faker from 'faker'

const baseUrl: string = Cypress.config().baseUrl
describe('Login', function () {
  beforeEach(() => {
    cy.server()
    cy.visit('login')
  })
  it('should Login Page load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readonly')
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Campo Obrigatório')
      .should('contain.text', '🔴')
    cy.getByTestId('password').should('have.attr', 'readonly')
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Campo Obrigatório')
      .should('contain.text', '🔴')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Login Page show error when form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.words(3))
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Valor Inválido')
      .should('contain.text', '🔴')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Valor Inválido')
      .should('contain.text', '🔴')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Login Page show valid message when form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Tudo Certo!')
      .should('contain.text', '🟢')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Tudo Certo!')
      .should('contain.text', '🟢')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Login Page show error message when Credentials are invalid', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 401,
      response: {
        error: faker.random.words()
      }
    })
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist').should('contain.text', 'Credenciais inválidas')
    cy.url().should('eq', `${baseUrl}/login`)
    cy.window().then(window => assert.isNull(window.localStorage.getItem('accessToken')))
  })
  it('should Login Page change to Main Page when Credentials are valid', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        xxx: faker.datatype.uuid()
      }
    })
    cy.getByTestId('email').focus().type('ricardo@gmail.com')
    cy.getByTestId('password').focus().type('123456')
    cy.getByTestId('submit').click()
    cy.getByTestId('main-error').should('not.exist')
    cy.getByTestId('spinner').should('not.exist')
    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then(window => assert.isOk(window.localStorage.getItem('accessToken')))
  })
})
