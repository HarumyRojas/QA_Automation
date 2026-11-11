describe("E01 - Gestión del carrito de compras", () => {
  beforeEach(() => {
    cy.visit("https://with-bugs.practicesoftwaretesting.com/#/");
  });

  // TC-COM-001: Agregar producto al carrito
  it("TC-COM-001 - Permite agregar un producto al carrito", () => {
    // 1. Abrir el menú Categories
    cy.get('[data-test="nav-categories"]').click();

    // 2. Seleccionar Hand Tools
    cy.get('[data-test="nav-hand-tools"]').click();

    // 3. Escuchar la petición de productos
    cy.intercept("GET", "**/products*").as("productsByCategory");

    // 4. Seleccionar el filtro Pliers
    cy.get('[data-test="category-7"]').check();

    // 5. Esperar la respuesta del servidor
    cy.wait("@productsByCategory");

    // 6. Verificar que el filtro esté seleccionado
    cy.get('[data-test="category-7"]').should("be.checked");

    // 7. Buscar el producto Pliers
    cy.get('[data-test="product-name"]')
      .filter((index, element) => element.textContent.trim() === "Pliers")
      .should("have.length", 1)
      .should("be.visible")
      .click();

    // 8. Verificar el detalle del producto
    cy.get('h1[data-test="product-name"]').should("have.text", "Pliers");

    // 9. Agregar el producto al carrito
    cy.get('[data-test="add-to-cart"]').click();

    // 10. Ingresar al carrito
    cy.get('[data-test="nav-cart"]').click();

    // 11. Verificar que el producto esté en el carrito
    cy.contains("td", "Pliers").should("be.visible");
  });

  // TC-COM-002: Eliminar producto del carrito
  it("TC-COM-002 - Permite eliminar un producto del carrito", () => {
    // 1. Abrir el menú Categories
    cy.get('[data-test="nav-categories"]').click();

    // 2. Seleccionar Hand Tools
    cy.get('[data-test="nav-hand-tools"]').click();

    // 3. Escuchar la petición de productos
    cy.intercept("GET", "**/products*").as("productsByCategory");

    // 4. Seleccionar el filtro Pliers
    cy.get('[data-test="category-7"]').check();

    // 5. Esperar la respuesta del servidor
    cy.wait("@productsByCategory");

    // 6. Verificar que el filtro esté seleccionado
    cy.get('[data-test="category-7"]').should("be.checked");

    // 7. Buscar el producto Pliers
    cy.get('[data-test="product-name"]')
      .filter((index, element) => element.textContent.trim() === "Pliers")
      .should("have.length", 1)
      .should("be.visible")
      .click();

    // 8. Verificar el detalle del producto
    cy.get('h1[data-test="product-name"]').should("have.text", "Pliers");

    // 9. Agregar el producto al carrito
    cy.get('[data-test="add-to-cart"]').click();

    // 10. Ingresar al carrito
    cy.get('[data-test="nav-cart"]').click();

    // 11. Verificar que el producto esté en el carrito
    cy.contains("td", "Pliers").should("be.visible");

    // 12. Hacer clic en el botón de eliminar
    cy.get("a.btn.btn-danger").click();

    // 13. Verificar que el producto haya desaparecido
    cy.contains("td", "Pliers").should("not.exist");
  });

  // TC-COM-003: Ordenar productos de mayor a menor precio
  it("TC-COM-003 - Ordena los productos de mayor a menor precio", () => {
    // 1. Abrir el menú Categories
    cy.get('[data-test="nav-categories"]').click();

    // 2. Seleccionar Hand Tools
    cy.get('[data-test="nav-hand-tools"]').click();

    // 3. Seleccionar ordenamiento de mayor a menor
    cy.get('[data-test="sort"]').select("Price (High - Low)");

    // 4. Obtener los precios de los productos
    cy.get('[data-test="product-price"]').then(($prices) => {
      const prices = [...$prices].map((element) =>
        Number(element.textContent.replace("$", "").trim()),
      );

      // 5. Verificar que estén ordenados de mayor a menor
      const expectedOrder = [...prices].sort((a, b) => b - a);

      expect(prices).to.deep.equal(expectedOrder);
    });
  });

  // TC-COM-004: Ordenar productos de menor a mayor precio
  it("TC-COM-004 - Ordena los productos de menor a mayor precio", () => {
    // 1. Abrir el menú Categories
    cy.get('[data-test="nav-categories"]').click();

    // 2. Seleccionar Hand Tools
    cy.get('[data-test="nav-hand-tools"]').click();

    // 3. Seleccionar ordenamiento de menor a mayor
    cy.get('[data-test="sort"]').select("Price (Low - High)");

    // 4. Obtener los precios de los productos
    cy.get('[data-test="product-price"]').then(($prices) => {
      const prices = [...$prices].map((element) =>
        Number(element.textContent.replace("$", "").trim()),
      );

      // 5. Verificar que estén ordenados de menor a mayor
      const expectedOrder = [...prices].sort((a, b) => a - b);

      expect(prices).to.deep.equal(expectedOrder);
    });
  });
});
