describe('Módulo de Registro de Usuarios', () => {
    it('TC-REG-001: Envío del formulario de registro vacío', () => {
        cy.visit('/auth/register');
        cy.get('[data-test="register-submit"]').click();
        cy.get('.alert, .help-block').should('be.visible');
        cy.url().should('include', '/auth/register');
    });

    it('TC-REG-002: Registro de cliente con datos válidos y mail dinámico', () => {
        const dynamicEmail = `user_${Date.now()}@test.com`;
        cy.visit('/auth/register');
        cy.get('[data-test="first-name"]').type('John');
        cy.get('[data-test="last-name"]').type('Doe');
        cy.get('[data-test="dob"]').type('1990-01-01');
        cy.get('[data-test="address"]').type('Calle Falsa 123');
        cy.get('[data-test="postcode"]').type('1000');
        cy.get('[data-test="city"]').type('Buenos Aires');
        cy.get('[data-test="state"]').type('BA');
        cy.get('[data-test="country"]').select('AR');
        cy.get('[data-test="phone"]').type('123456789');
        cy.get('[data-test="email"]').type(dynamicEmail);
        cy.get('[data-test="password"]').type('Password123!');
        cy.get('[data-test="register-submit"]').click();
        
        cy.url().should('include', '/auth/login');
    });

    it('TC-REG-003: Registro con formato de correo electrónico inválido', () => {
        cy.visit('/auth/register');
        cy.get('[data-test="email"]').type('correo-sin-arroba.com');
        cy.get('[data-test="register-submit"]').click();
        cy.get('[data-test="email-error"]').should('be.visible');
        cy.url().should('include', '/auth/register');
    });

    it('TC-REG-004: Registro con un solo carácter en el campo First name (Caso de borde)', () => {
        const dynamicEmail = `user_${Date.now()}@test.com`;
        cy.visit('/auth/register');
        
        // Ingresar solo 1 carácter en el nombre
        cy.get('[data-test="first-name"]').type('A'); 
        cy.get('[data-test="last-name"]').type('Pérez');
        cy.get('[data-test="dob"]').type('1990-05-15');
        cy.get('[data-test="address"]').type('Calle Falsa 123');
        cy.get('[data-test="postcode"]').type('1000');
        cy.get('[data-test="city"]').type('Buenos Aires');
        cy.get('[data-test="state"]').type('BA');
        cy.get('[data-test="country"]').select('AR');
        cy.get('[data-test="phone"]').type('1122334455');
        cy.get('[data-test="email"]').type(dynamicEmail);
        cy.get('[data-test="password"]').type('Password123!');
        
        cy.get('[data-test="register-submit"]').click();

    // Validar comportamiento de borde (permite controladamente o muestra validación)
    cy.get('body').then(($body) => {
        if ($body.find('[data-test="first-name-error"], .help-block, .alert-danger').length > 0) {
            cy.get('[data-test="first-name-error"], .help-block, .alert-danger').should('be.visible');
            cy.url().should('include', '/auth/register');
        } else {
        cy.url().should('include', '/auth/login');
        }
        });
    });
});