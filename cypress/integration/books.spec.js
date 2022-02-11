import books from '../fixtures/books.json';

describe('Books', () => {
    it('should show books', () => {
        cy.intercept(
            {
                method: 'GET',
                url: '/books',
            },
            {statusCode: 200, fixture: 'books.json'}
        ).as('getAllBooks');

        cy.login('testUser', 'testPassword');

        cy.url().should('contain', '/books');
        cy.wait('@getAllBooks');
        cy.get('.placeholder-image-text').each((textDiv, index) => {
            cy.wrap(textDiv).should('have.text', books[index].title);
        });
    });

    it('should show placeholder text without books', () => {
        cy.login('testUser', 'testPassword');

        cy.url().should('contain', '/books');
        cy.get('p').should('have.text', "You don't have any books in your Collection yet. Go ahead and add some!");
    });
});
