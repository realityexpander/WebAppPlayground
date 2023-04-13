describe('login-spec', () => {
  const baseUrl = 'http://localhost:8081';
  const specName = Cypress.spec.name + ' - ';

  Cypress.Screenshot.defaults({
    screenshotOnRunFailure: true,
    overwrite: true,
  })
  

  beforeEach(() => {
    cy.visit(baseUrl + '/login');
  });

  afterEach(() => {
    cy.visit(baseUrl + '/logout');
  });

  it('is able to log a user in', () => {
    const testName = specName + Cypress.currentTest.title
    //cy.intercept('POST', `/api/login`).as('login'); // note: no baseUrl. This is a relative path in the app.

    // Stub the login response
    cy.intercept('POST', '/api/login', (req) => {
      const { body } = req;
      req.body.clientIpAddress = "123.456.789.012";

      req.continue(res => {
        res.body = {
            token: "12345678901234567890123456",
            jwtToken: "eyj1234567890123456789012345678901234567890",
            clientIpAddress: "123.456.789.012"
        }
      })
    }).as('login');

    // Arrange
    // cy.get('[data-cy="email"]')
    ///html/body/app-root//page-login//div/form/label[1]/input
    cy.get("app-root")
      .shadow()
      .find("page-login")
      .shadow()
      .find("[data-cy='input-text-email']")
      .type('chris.athanas.now@gmail.com');

      // .should( e => {
      //   console.log("hello" + e);
      //   const [h1] = e.get();
      //   console.log("h1!", h1, h1.textContent);
      //   expect(h1.textContent).to.equal("Login");
      // })

    cy.get("app-root")
      .shadow()
      .find("page-login")
      .shadow()
      .find('#password')
      .type('Password1$', {force: true}); // {force: true} prevents this error: CypressError: "cy.type() failed because it targeted a disabled element"

    cy.screenshot(testName + ".pre-login");

    // Act
    cy.get("app-root")
      .shadow()
      .find("page-login")
      .shadow()
      .find('button[type="submit"]')
      .click();

      cy.wait('@login');
    // cy.wait(500);

    cy.screenshot(testName + ".post-login");

    // Assert
    let matchUrl = baseUrl + '/';
    cy.url().should('match', new RegExp(matchUrl));
  })
})