describe("E04 - Autenticación", () => {
  // Se ejecuta antes de cada caso de prueba
  beforeEach(() => {
    cy.visit("https://with-bugs.practicesoftwaretesting.com/#/");
  });

  it("TC-LOGIN-003 - Inicio de sesión con credenciales válidas", () => {
    cy.fixture("customer").then((customer) => {
      cy.get('[data-test="nav-sign-in"]').click();

      cy.get('[data-test="email"]').should("be.visible").type(customer.email);

      cy.get('[data-test="password"]')
        .should("be.visible")
        .type(customer.password);

      cy.get('[data-test="login-submit"]').click();
    });
  });

  it("TC-LOGIN-001 - Rechaza el inicio de sesión con contraseña incorrecta", () => {
    cy.fixture("customer").then((customer) => {
      cy.get('[data-test="nav-sign-in"]').click();

      cy.get('[data-test="email"]').should("be.visible").type(customer.email);

      cy.get('[data-test="password"]').should("be.visible").type("otra clave");

      cy.get('[data-test="login-submit"]').click();

      cy.contains("Invalid email or password").should("be.visible");

      cy.url().should("include", "/auth/login");
    });
  });

  it("TC-LOGIN-002 - Rechaza el inicio de sesión con correo incorrecto", () => {
    cy.fixture("customer").then((customer) => {
      // 1. Acceder al formulario Login
      cy.get('[data-test="nav-sign-in"]').click();

      // 2. Ingresar un correo incorrecto
      cy.get('[data-test="email"]')
        .should("be.visible")
        .type("custome@practicesoftwaretesting.com");

      // 3. Ingresar la contraseña válida
      cy.get('[data-test="password"]')
        .should("be.visible")
        .type(customer.password);

      // 4. Enviar el formulario
      cy.get('[data-test="login-submit"]').click();

      // 5. Verificar el mensaje de error
      cy.contains("Invalid email or password").should("be.visible");

      // 6. Verificar que permanezca en Login
      cy.url().should("include", "/auth/login");
    });
  });

  it("TC-LOGIN-004 - Impide iniciar sesión con ambos campos vacíos", () => {
    // 1. Abrir el formulario Login
    cy.get('[data-test="nav-sign-in"]').click();

    // 2. Comprobar que ambos campos estén vacíos
    cy.get('[data-test="email"]').should("have.value", "");

    cy.get('[data-test="password"]').should("have.value", "");

    // 3. Presionar Login sin ingresar datos
    cy.get('[data-test="login-submit"]').click();

    // 4. Verificar que permanezca en Login
    cy.url().should("include", "/auth/login");
  });
});
