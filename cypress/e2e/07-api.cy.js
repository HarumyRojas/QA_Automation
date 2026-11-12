/**
 * Challenge Final: Testing con Cypress
 * Archivo: cypress/e2e/07-api.cy.js
 * Módulo: API / Servicios (Flujo 3.7 y pruebas de integración)
 */

describe("E07 - Servicios API", () => {
  const apiUrl = "https://api-with-bugs.practicesoftwaretesting.com";
  let customerData;
  let contactData;

  before(() => {
    // Carga de datos de prueba desde fixtures existentes
    cy.fixture("customer").then((data) => {
      customerData = data;
    });
    cy.fixture("contact").then((data) => {
      contactData = data;
    });
  });

  // ===========================================================================
  // CASOS POSITIVOS
  // ===========================================================================
  describe("Casos Positivos", () => {
    it("TC-API-001 - Flujo 3.7: Consulta de catálogo e inicio de sesión por API en un mismo flujo", () => {
      // 1. Consultar lista de productos y verificar status 200 y que no está vacía
      cy.request({
        method: "GET",
        url: `${apiUrl}/products`,
      }).then((productsResponse) => {
        expect(productsResponse.status, "Status de productos debe ser 200").to.eq(200);
        expect(productsResponse.body, "El cuerpo debe tener la propiedad data").to.have.property("data");
        expect(productsResponse.body.data, "La lista data debe ser un arreglo").to.be.an("array");
        expect(productsResponse.body.data.length, "La lista de productos no debe estar vacía").to.be.greaterThan(0);

        const firstProduct = productsResponse.body.data[0];
        expect(firstProduct).to.have.property("id");
        expect(firstProduct).to.have.property("name");
        expect(firstProduct).to.have.property("price");

        // 2. Iniciar sesión por API con el usuario de prueba y verificar status 200 y token de acceso
        cy.request({
          method: "POST",
          url: `${apiUrl}/users/login`,
          body: {
            email: customerData.email,
            password: customerData.password,
          },
        }).then((loginResponse) => {
          expect(loginResponse.status, "Status de login debe ser 200").to.eq(200);
          expect(loginResponse.body, "Respuesta debe incluir access_token").to.have.property("access_token");
          expect(loginResponse.body.access_token, "access_token debe ser un string no vacío").to.be.a("string").and.not.be.empty;
          expect(loginResponse.body).to.have.property("token_type", "bearer");
        });
      });
    });

    it("TC-API-002 - Consulta de información detallada de producto por ID", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/products/1`,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.id).to.eq(1);
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("price");
        expect(res.body).to.have.property("stock");
      });
    });

    it("TC-API-003 - Consulta del árbol completo de categorías y subcategorías", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/categories/tree`,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array").that.is.not.empty;
        expect(res.body[0]).to.have.property("sub_categories");
      });
    });
  });

  // ===========================================================================
  // CASOS NEGATIVOS
  // ===========================================================================
  describe("Casos Negativos", () => {
    it("TC-API-004 - Rechazo de autenticación con contraseña incorrecta devolviendo 401 Unauthorized", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/users/login`,
        body: {
          email: customerData.email,
          password: "clave_totalmente_incorrecta",
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body).to.have.property("error", "Unauthorized");
      });
    });

    it("TC-API-005 - Manejo de error 404 al consultar un producto inexistente", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/products/999999`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body).to.have.property("message", "Requested item not found");
      });
    });

    it("TC-API-006 - Validación de campos obligatorios en el formulario de contacto (código 422)", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/messages`,
        body: {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(422);
        expect(res.body).to.have.property("subject");
        expect(res.body).to.have.property("message");
      });
    });

    it("TC-API-007 - Rechazo de caracteres de inyección SQL en autenticación sin producir excepciones 500", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/users/login`,
        body: {
          email: "' OR 1=1 --",
          password: "anypassword",
        },
        failOnStatusCode: false,
      }).then((res) => {
        // Se espera que la API rechace credenciales inválidas con 401 o 422 sin crashear en 500
        expect(res.status, "El login debe responder 401 Unauthorized ante caracteres inválidos").to.be.oneOf([401, 422]);
      });
    });

    it("TC-API-008 - Restricción de acceso no autenticado al listado de facturas de clientes (código 401)", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/invoices`,
        failOnStatusCode: false,
      }).then((res) => {
        // Se espera que un endpoint privado requiera autenticación y responda 401
        expect(res.status, "El endpoint de facturas debe protegerse con código 401").to.eq(401);
      });
    });

    it("TC-API-009 - Validación de formato de correo en formulario de contacto rechazando correos inválidos (código 422)", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/messages`,
        body: contactData.invalidEmailContact,
        failOnStatusCode: false,
      }).then((res) => {
        // Se espera que la API valide la sintaxis del correo y devuelva error 422
        expect(res.status, "Debe devolver código 422 ante un formato de correo inválido").to.eq(422);
      });
    });

    it("TC-API-010 - Validación de formato de correo electrónico durante el registro de usuarios (código 422)", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/users/register`,
        body: {
          first_name: "Usuario",
          last_name: "Prueba",
          address: "Avenida Siempre Viva 742",
          city: "Buenos Aires",
          state: "CABA",
          country: "Argentina",
          postcode: "1001",
          phone: "1122334455",
          dob: "1990-01-01",
          email: "correo_sin_arroba_ni_dominio",
          password: "Password123!",
        },
        failOnStatusCode: false,
      }).then((res) => {
        // Se espera que no se cree la cuenta y responda con 422 Unprocessable Content
        expect(res.status, "El registro con correo inválido debe responder 422").to.eq(422);
      });
    });
  });

  // ===========================================================================
  // CASOS DE BORDE
  // ===========================================================================
  describe("Casos de Borde", () => {
    it("TC-API-011 - Sanitización de caracteres especiales y scripts en el buscador sin causar error 500", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/products/search?q=%3Cscript%3Ealert(1)%3C/script%3E`,
        failOnStatusCode: false,
      }).then((res) => {
        // El servidor debe responder de forma controlada (200 o 400), nunca con error 500
        expect(res.status, "La búsqueda con caracteres especiales debe responder 200 o 400").to.be.oneOf([200, 400]);
      });
    });

    it("TC-API-012 - Gestión de parámetros de ordenamiento no soportados de forma controlada", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/products?sort=campo_no_existente`,
        failOnStatusCode: false,
      }).then((res) => {
        // Debe ignorar el orden o responder 400, sin fallar con error de servidor 500
        expect(res.status, "El ordenamiento no soportado debe controlarse con 200 o 400").to.be.oneOf([200, 400]);
      });
    });

    it("TC-API-013 - Protección de datos sensibles sin exponer hashes de contraseña en el alta de usuario", () => {
      const uniqueEmail = `qa_user_${Date.now()}@testing.com`;
      cy.request({
        method: "POST",
        url: `${apiUrl}/users/register`,
        body: {
          first_name: "QA",
          last_name: "Tester",
          address: "Calle Falsa 123",
          city: "Cordoba",
          state: "Cordoba",
          country: "Argentina",
          postcode: "5000",
          phone: "3511234567",
          dob: "1992-05-15",
          email: uniqueEmail,
          password: "PasswordSeguro123!",
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(201);
        // La entidad devuelta no debe exponer contraseñas ni hashes
        expect(res.body, "La respuesta de la API no debe exponer la propiedad password").not.to.have.property("password");
      });
    });
  });
});
