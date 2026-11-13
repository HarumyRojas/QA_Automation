// Comando para inicio de sesión por UI
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/auth/login');
    cy.get('[data-test="email"]').type(email);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-submit"]').click();
});

// Comando para rellenar formulario de contacto
Cypress.Commands.add('fillContactForm', (data, filePath = null) => {
    cy.get('[data-test="first-name"]').type(data.firstName);
    cy.get('[data-test="last-name"]').type(data.lastName);
    cy.get('[data-test="email"]').type(data.email);
    cy.get('[data-test="subject"]').select(data.subject);
    cy.get('[data-test="message"]').type(data.message);

    // Si se le pasa un archivo como segundo parámetro, lo adjunta
    if (filePath) {
        cy.get('[data-test="attachment"]').selectFile(filePath);
    }

    cy.get('[data-test="contact-submit"]').click();
});