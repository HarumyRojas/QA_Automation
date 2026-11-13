describe('Módulo de Formulario de Contacto (TC-CON-001 al TC-CON-005)', () => {
  beforeEach(() => {
    cy.fixture('contact').as('contact');
  });

  // TC-CON-001: Envío de mensaje con datos válidos y sin adjunto
  it('TC-CON-001: Envío de mensaje de contacto con datos válidos y sin adjunto', function() {
    cy.visit('/contact');
    
    cy.fillContactForm(this.contact.contactData);
    cy.get('.alert-success').should('contain.text', 'Thanks for your message');
  });

  it('TC-CON-002: Envío de formulario adjuntando archivos permitidos (PDF/JPG)', function() {
    cy.visit('/contact');
    cy.fillContactForm(this.contact.contactData, 'cypress/fixtures/challenge.pdf');
    cy.get('.alert-success').should('contain.text', 'Thanks for your message');
  });

  // TC-CON-003: Intento de adjuntar una extensión no permitida (ej: un archivo .png grande u otro formato)
  it('TC-CON-003: Intento de adjuntar archivo con extensión o formato no permitido', function() {
    cy.visit('/contact');
    
    cy.get('[data-test="first-name"]').type(this.contact.contactData.firstName);
    cy.get('[data-test="last-name"]').type(this.contact.contactData.lastName);
    cy.get('[data-test="email"]').type(this.contact.contactData.email);
    cy.get('[data-test="subject"]').select(this.contact.contactData.subject);
    cy.get('[data-test="message"]').type(this.contact.contactData.message);

    cy.get('[data-test="attachment"]').selectFile('cypress/fixtures/imagen.png');
    cy.get('[data-test="contact-submit"]').click();
    cy.get('.alert-success').should('not.exist'); 
    cy.get('[data-test="attachment-error"], .help-block, .alert-danger')
      .should('be.visible')
      .and('contain.text', 'The file extension is incorrect, we only accept txt files.');
  });

  // TC-CON-004: Archivo en el límite de tamaño permitido (Probando con example.txt)
  it('TC-CON-004: Validar comportamiento en el límite de tamaño de archivo permitido', function() {
    cy.visit('/contact');

    cy.fillContactForm(this.contact.contactData, 'cypress/fixtures/example.txt');

    cy.get('body').should('be.visible');
  });

 // TC-CON-005: Intento de envío de formulario de contacto con email inválido (Debe dar FAIL si la app lo deja pasar)
  it('TC-CON-005: Intento de envío de formulario de contacto con email inválido', function() {
    cy.visit('/contact');
    
    cy.get('[data-test="first-name"]').type(this.contact.contactData.firstName);
    cy.get('[data-test="last-name"]').type(this.contact.contactData.lastName);
    cy.get('[data-test="email"]').type('correo-invalido-sin-arroba'); // Email inválido
    cy.get('[data-test="subject"]').select(this.contact.contactData.subject);
    cy.get('[data-test="message"]').type(this.contact.contactData.message);
    
    cy.get('[data-test="contact-submit"]').click();
    cy.get('.alert-success').should('not.exist');
    cy.get('[data-test="email-error"], .help-block, .alert-danger').should('be.visible');
    cy.url().should('include', '/contact');
  });
});