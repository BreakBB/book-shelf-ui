Cypress.Commands.add('login', (username, password) => {
    cy.visit('login');
    cy.intercept(
        {
            method: 'POST',
            url: '/login',
        },
        {
            statusCode: 200,
            data: {
                access_token: 'someAccessToken',
                refresh_token: 'someRefreshToken',
            },
        }
    ).as('loginRequest');
    cy.intercept({method: 'GET', url: '/login/checkToken'}, {statusCode: 200, body: true}).as('tokenCheck');

    cy.get('#username').type(username);
    cy.get('#password').type(password);

    cy.get('.login-button').click();
});
