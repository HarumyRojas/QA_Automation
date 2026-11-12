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

// ***********************************************
// Custom commands del proyecto Toolshop
// ***********************************************

const API_URL = 'https://api-with-bugs.practicesoftwaretesting.com';

/**
 * Inicia sesión mediante solicitud HTTP POST directa a la API.
 * @param {string} email
 * @param {string} password
 */
Cypress.Commands.add('loginApi', (email, password) => {
  return cy.request({
    method: 'POST',
    url: `${API_URL}/users/login`,
    body: { email, password },
    failOnStatusCode: false
  });
});

/**
 * Completa e interactúa con el formulario de inicio de sesión en la interfaz web.
 * @param {string} email
 * @param {string} password
 */
Cypress.Commands.add('loginUi', (email, password) => {
  cy.visit('https://with-bugs.practicesoftwaretesting.com/#/auth/login');
  if (email) {
    cy.get('[data-test="email"]').clear().type(email);
  }
  if (password) {
    cy.get('[data-test="password"]').clear().type(password);
  }
  cy.get('[data-test="login-submit"]').click();
});

/**
 * Completa y envía el formulario de contacto vía API.
 * @param {Object} contactData
 */
Cypress.Commands.add('sendContactMessageApi', (contactData) => {
  return cy.request({
    method: 'POST',
    url: `${API_URL}/messages`,
    body: contactData,
    failOnStatusCode: false
  });
});