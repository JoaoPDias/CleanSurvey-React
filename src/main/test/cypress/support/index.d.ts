declare namespace Cypress {
  interface Chainable {
    getByTestId: (value: string) => Chainable<Element>
    shouldInputStatusBeInvalid: (field: string, error: string) => Chainable<Element>
    shouldInputStatusBeValid: (field: string) => Chainable<Element>
    validateMainError: (text: string) => Chainable<Element>
    mockInvalidCredentialsError: (url: RegExp, method: string) => Chainable<Element>
    mockForbiddenError: (url: RegExp, method: string) => Chainable<Element>
    mockUnexpectedError: (url: RegExp, method: string) => Chainable<Element>
    mockOk: (url: RegExp, method: string, response: any) => Chainable<Element>
    shouldLocalStorageItemExist: (key: string) => Chainable<Element>
    shouldLocalStorageItemNotExist: (key: string) => Chainable<Element>
    signup: (name: string, email: string, password: string, passwordConfirmation: string) => Chainable<Element>
    login: (email: string, password: string) => Chainable<Element>
  }
}
