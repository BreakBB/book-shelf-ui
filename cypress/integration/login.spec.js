describe('Login', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login');
    });

    it('should succeed with valid credentials', () => {
        cy.intercept(
            {
                method: 'POST',
                url: '/login',
            },
            {statusCode: 200}
        ).as('loginRequest');

        cy.get('#username').type('testUsername');
        cy.get('#password').type('testPassword');

        cy.get('.login-button').click();

        cy.url().should('include', '/books');
    });

    it('should fail with invalid credentials', () => {
        cy.intercept(
            {
                method: 'POST',
                url: '/login',
            },
            {statusCode: 500}
        ).as('loginRequest');

        cy.get('#username').type('tanja');
        cy.get('#password').type('abc123');
        cy.get('.login-button').click();

        cy.get('.login-error-message');
        cy.url().should('include', '/login');
    });

    it('should fail without credentials', () => {
        cy.get('.login-button').click();

        cy.get('.login-error-message');
        cy.url().should('include', '/login');
    });

    it('should fail without password', () => {
        cy.get('#username').type('tanja');
        cy.get('.login-button').click();

        cy.get('.login-error-message');
        cy.url().should('include', '/login');
    });

    it('should fail without username', () => {
        cy.get('#password').type('abc123');
        cy.get('.login-button').click();

        cy.get('.login-error-message');
        cy.url().should('include', '/login');
    });

    it('should logout and navigate to login page', () => {
        cy.login('testUsername', 'testPassword');
        cy.url().should('include', '/books');

        cy.get('.logout-button').click();

        cy.url().should('include', '/login');
    });

    it('should redirect away from login page', () => {
        cy.intercept(
            {
                method: 'GET',
                url: '/books',
            },
            {statusCode: 200, body: []}
        ).as('getAllBooks');
        cy.login('testUsername', 'testPassword');
        cy.url().should('include', '/books');

        cy.visit('http://localhost:3000/login');

        cy.url().should('include', '/books');
    });
});
