// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import faker from 'faker'

Cypress.Commands.add('getByTestId', (id) => cy.get(`[data-testid=${id}]`))

Cypress.Commands.add('shouldInputStatusBeInvalid', (field, error) => {
  cy.getByTestId(field)
    .should('have.attr', 'title', error)
  cy.getByTestId(`${field}-label`)
    .should('have.attr', 'title', error)
  cy.getByTestId(`${field}-wrap`).should('have.attr', 'data-status', 'invalid')
})

Cypress.Commands.add('shouldInputStatusBeValid', (field) => {
  cy.getByTestId(`${field}-wrap`).should('have.attr', 'data-status', 'valid')
  cy.getByTestId(field)
    .should('not.have.attr', 'title')
  cy.getByTestId(`${field}-label`)
    .should('not.have.attr', 'title')
})

Cypress.Commands.add('mockUnexpectedError', (url, method) => {
  cy.server()
  cy.route({
    method: method,
    url: url,
    status: faker.helpers.randomize([400, 404, 500]),
    response: {
      error: faker.random.words()
    }
  })
})
Cypress.Commands.add('mockForbiddenError', (url, method) => {
  cy.server()
  cy.route({
    method: method,
    url: url,
    status: 403,
    response: {
      error: faker.random.words()
    }
  })
})
Cypress.Commands.add('mockInvalidCredentialsError', (url, method) => {
  cy.server()
  cy.route({
    method: method,
    url: url,
    status: 401,
    response: {
      error: faker.random.words()
    }
  })
})
Cypress.Commands.add('mockOk', (url, method, response) => {
  cy.server()
  cy.route({
    method: method,
    url: url,
    status: 200,
    response
  })
})

Cypress.Commands.add('validateMainError', (text) => {
  cy.getByTestId('spinner').should('not.exist')
  cy.getByTestId('main-error').should('exist').should('contain.text', text)
})
Cypress.Commands.add('shouldLocalStorageItemExist', (key) => {
  cy.window().then(window => assert.isOk(window.localStorage.getItem(key)))
})

Cypress.Commands.add('shouldLocalStorageItemNotExist', (key) => {
  cy.window().then(window => assert.isNull(window.localStorage.getItem(key)))
})

Cypress.Commands.add('signup', (name, email, password, passwordConfirmation) => {
  cy.getByTestId('name').focus().type(name)
  cy.getByTestId('email').focus().type(email)
  cy.getByTestId('password').focus().type(password)
  cy.getByTestId('passwordConfirmation').focus().type(passwordConfirmation)
})

Cypress.Commands.add('login', (email, password) => {
  cy.getByTestId('email').focus().type(email)
  cy.getByTestId('password').focus().type(password)
})
