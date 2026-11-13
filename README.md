# QA Automation · Challenge Final Toolshop (Grupo 7)

Proyecto final de automatización de pruebas end-to-end (E2E) y pruebas de servicios API sobre la plataforma de práctica **Toolshop** ([Practice Software Testing](https://with-bugs.practicesoftwaretesting.com/)), desarrollado con **Cypress** y **JavaScript**.

---

## 📌 Enlaces del Proyecto

| Recurso | Enlace de Acceso |
| :--- | :--- |
| **Tablero de Trello (Bugs)** | [Ver Tablero en Trello](https://trello.com/b/R4cd6xeN/qa-automation) |
| **Plan de Casos de Prueba (Google Sheets)** | [Ver Plan de Pruebas](https://docs.google.com/spreadsheets/d/1T6PWlYooJ3LgRQ2EegPSe8cwgZ3_3kDN/edit?usp=sharing&ouid=115230497352031696952&rtpof=true&sd=true) |
| **Repositorio en GitHub** | [GitHub - QA_Automation](https://github.com/HarumyRojas/QA_Automation) |
| **Documentación API (Swagger)** | [Swagger UI - Toolshop API](https://api-with-bugs.practicesoftwaretesting.com/api/documentation) |

---

## 👥 Integrantes del Equipo

| Nombre y Apellido | Correo Electrónico |
| :--- | :--- |
| **Harumy Rojas Chuchon** | [harumyrojas7@gmail.com](mailto:harumyrojas7@gmail.com) |
| **Kevin Paul Tiano** | [533kevin335@gmail.com](mailto:533kevin335@gmail.com) |
| **Maria Fernanda Vassallo** | [fernandavassallo42@gmail.com](mailto:fernandavassallo42@gmail.com) |
| **Mayra Taborda** | [tabordamayra02@gmail.com](mailto:tabordamayra02@gmail.com) |

---

## 📁 Estructura del Repositorio

```text
QA_Automation/
├── cypress/
│   ├── e2e/
│   │   ├── 01-compra.cy.js       # E01 - Flujo de compra y gestión del carrito
│   │   ├── 02-login.cy.js        # E04 - Autenticación y control de accesos
│   │   ├── 03-registro.cy.js     # E02 - Validaciones del formulario de registro
│   │   ├── 04-contacto.cy.js     # E03 - Formulario de contacto y envío de adjuntos
│   │   └── 07-api.cy.js          # E07 - Pruebas de integración API (Flujo 3.7 y servicios)
│   ├── fixtures/
│   │   ├── customer.json         # Credenciales de usuario de prueba
│   │   ├── contact.json          # Datos de prueba para formulario y API de contacto
│   │   ├── example.txt           # Archivo de texto para prueba de adjuntos
│   │   ├── imagen.png            # Archivo de imagen para prueba de adjuntos
│   │   └── challenge.pdf         # Archivo PDF para prueba de adjuntos
│   └── support/
│       ├── commands.js           # Custom Commands (login, fillContactForm, loginApi, sendContactMessageApi)
│       └── e2e.js                # Configuración global del runner
├── cypress.config.js             # Configuración base de Cypress
├── package.json                  # Dependencias y scripts de ejecución
└── README.md                     # Documentación principal del proyecto
```

---

## 🛠️ Tecnologías Utilizadas

* **Framework de Testing:** [Cypress](https://www.cypress.io/) (v16+)
* **Lenguaje:** JavaScript (Node.js)
* **Gestor de Paquetes:** npm
* **Seguimiento de Defectos:** Trello
* **Documentación de Casos de Prueba:** Google Sheets / Microsoft Excel

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/HarumyRojas/QA_Automation.git
cd QA_Automation
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar las pruebas

#### Abrir la interfaz interactiva de Cypress (Modo GUI):
```bash
npm run cypress:open
```

#### Ejecutar todas las pruebas en modo headless (Consola):
```bash
npm test
```

#### Ejecutar únicamente la suite de pruebas de API:
```bash
npm run test:api
```

---

## 📋 Resumen de Cobertura y Bugs Detectados

El proyecto cubre pruebas de tipo **Positivas**, **Negativas** y **De Borde**, implementando aserciones rigurosas para validar tanto el funcionamiento esperado como los errores y vulnerabilidades presentes en la aplicación:

1. **Gestión de Carrito y Compras:** Adición de productos, eliminación mediante botón X y ordenamiento por precio.
2. **Autenticación (Login):** Validación con credenciales válidas, contraseñas erróneas y campos obligatorios vacíos.
3. **Registro de Clientes:** Validación de campos requeridos y formatos de datos.
4. **Formulario de Contacto:** Envío de mensajes y validación de tipos y tamaños de archivos adjuntos.
5. **Servicios API (cy.request):** 
   * Flujo obligatorio 3.7 (consulta de catálogo y autenticación con obtención de token Bearer en una misma secuencia).
   * Detección y evidencia de vulnerabilidades: caída 500 por inyección SQL en `/users/login`, acceso no autenticado a `/invoices` (BOLA), ausencia de validación de correo en `/messages` y `/users/register`, crasheos ante tags XSS en buscador, y exposición de hash SHA256 de contraseña en la respuesta de registro.

Todos los defectos identificados se encuentran catalogados y documentados en el tablero de **Trello** con pasos detallados de reproducción y capturas de evidencia.
