import faker from 'faker'

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
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(3))
    cy.shouldInputStatusBeInvalid('name', 'Valor Inválido')
    cy.getByTestId('email').focus().type(faker.random.alphaNumeric(3))
    cy.shouldInputStatusBeInvalid('email', 'Valor Inválido')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    cy.shouldInputStatusBeInvalid('password', 'Valor Inválido')
    cy.getByTestId('passwordConfirmation').focus().type(faker.random.alphaNumeric(3))
    cy.shouldInputStatusBeInvalid('passwordConfirmation', 'Valor Inválido')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
  it('should Signup Page show error when password and passwordConfirmation are different', () => {
    const password = faker.random.alphaNumeric(15)
    cy.getByTestId('name').focus().type(faker.name.findName())
    cy.shouldInputStatusBeValid('name')
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.shouldInputStatusBeValid('email')
    cy.getByTestId('password').focus().type(password)
    cy.shouldInputStatusBeValid('password')
    cy.getByTestId('passwordConfirmation').focus().type(faker.random.alphaNumeric(15))
    cy.shouldInputStatusBeInvalid('passwordConfirmation', 'Valor diferente do esperado.')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('errorWrap').should('not.have.descendants')
  })
})
