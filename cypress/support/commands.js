// ***********************************************
// Custom commands del proyecto Toolshop
// ***********************************************

const API_URL = 'https://api-with-bugs.practicesoftwaretesting.com';

// ===============================================
// Comandos de Interfaz Gráfica (UI)
// ===============================================

// Comando para inicio de sesión por UI
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/auth/login');
    cy.get('[data-test="email"]').type(email);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-submit"]').click();
});

// Comando para rellenar formulario de contacto
Cypress.Commands.add('fillContactForm', (contact, filePath = null) => {
    cy.get('[data-test="first-name"]').type(contact.firstName);
    cy.get('[data-test="last-name"]').type(contact.lastName);
    cy.get('[data-test="email"]').type(contact.email);
    cy.get('[data-test="subject"]').select(contact.subject);
    cy.get('[data-test="message"]').type(contact.message);

    // Si se le pasa un archivo como segundo parámetro, lo adjunta
    if (filePath) {
        cy.get('[data-test="attachment"]').selectFile(filePath);
    }

    cy.get('[data-test="contact-submit"]').click();
});

// Alias alternativo para login interactivo
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

// ===============================================
// Comandos de API
// ===============================================

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
