import * as faker from 'faker'

const baseUrl: string = Cypress.config().baseUrl
describe('Login', function () {
  beforeEach(() => {
    cy.server()
    cy.visit('login')
  })
  it('should Login Page load with correct initial state', () => {
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'invalid')
    cy.getByTestId('email')
      .should('have.attr', 'readonly', 'readonly')
      .and('have.attr', 'title', 'Campo Obrigatório')
    cy.getByTestId('email-label')
      .should('have.attr', 'title', 'Campo Obrigatório')

    cy.getByTestId('password-wrap').should('have.attr', 'data-status', 'invalid')
    cy.getByTestId('password')
      .should('have.attr', 'readonly', 'readonly')
      .and('have.attr', 'title', 'Campo Obrigatório')
    cy.getByTestId('password-label')
      .should('have.attr', 'title', 'Campo Obrigatório')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Login Page show error when form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.words(3))
    cy.getByTestId('email')
      .should('have.attr', 'title', 'Valor Inválido')
    cy.getByTestId('email-label')
      .should('have.attr', 'title', 'Valor Inválido')
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'invalid')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('password')
      .should('have.attr', 'title', 'Valor Inválido')
    cy.getByTestId('password-label')
      .should('have.attr', 'title', 'Valor Inválido')
    cy.getByTestId('password-wrap').should('have.attr', 'data-status', 'invalid')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Login Page show valid message when form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'valid')
    cy.getByTestId('email')
      .should('not.have.attr', 'title', '')
    cy.getByTestId('email-label')
      .should('not.have.attr', 'title', '')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('password-wrap').should('have.attr', 'data-status', 'valid')
    cy.getByTestId('password')
      .should('not.have.attr', 'title', '')
    cy.getByTestId('password-label')
      .should('not.have.attr', 'title', '')

    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Login Page show InvalidCredentialsError message when Credentials are invalid', () => {
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
  it('should Login Page show UnexpectedError message when Status code is between 402 and 500', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: faker.datatype.number({
        min: 402,
        max: 500
      }),
      response: {
        error: faker.random.words()
      }
    })
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist').should('contain.text', 'Algo de errado aconteceu. Aguarde um momento para poder executar a funcionalidade')
    cy.url().should('eq', `${baseUrl}/login`)
    cy.window().then(window => assert.isNull(window.localStorage.getItem('accessToken')))
  })
  it('should Login Page change to Main Page when Credentials are valid', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        accessToken: faker.datatype.uuid()
      }
    })
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('main-error').should('not.exist')
    cy.getByTestId('spinner').should('not.exist')
    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then(window => assert.isOk(window.localStorage.getItem('accessToken')))
  })
  it('should Login Page show UnexpectedError when accessToken was not returned', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        invalidProperty: faker.datatype.uuid()
      }
    })
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('main-error').should('exist')
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist').should('contain.text', 'Algo de errado aconteceu. Aguarde um momento para poder executar a funcionalidade')
    cy.url().should('eq', `${baseUrl}/login`)
    cy.window().then(window => assert.isNull(window.localStorage.getItem('accessToken')))
  })
  it('should Login Page prevent multiple submits', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        accessToken: faker.datatype.uuid()
      }
    }).as('loginRequest')
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').dblclick()
    cy.get('@loginRequest.all').should('have.length', 1)
  })
  it('should Login Page change to Main Page when Credentials are valid and enter was pressed', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        accessToken: faker.datatype.uuid()
      }
    })
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5)).type('{enter}')
    cy.getByTestId('main-error').should('not.exist')
    cy.getByTestId('spinner').should('not.exist')
    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then(window => assert.isOk(window.localStorage.getItem('accessToken')))
  })
  it('should Login Page prevent submit when form is invalid and user pressed Enter', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        accessToken: faker.datatype.uuid()
      }
    }).as('loginRequest')
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    cy.get('@loginRequest.all').should('have.length', 0)
  })
})
