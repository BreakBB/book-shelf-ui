import React from 'react';
import { render } from '@testing-library/react';
import BookCard from './BookCard';
import { renderWithRouter, TEST_BOOKS } from '../../testUtils';
import userEvent from '@testing-library/user-event';
import { history } from '../../history';
import { BASE_URL } from '../../bookService';

describe('BookCardView', () => {
    it('should render the cover', () => {
        const book = TEST_BOOKS.harryPotter1;

        const { getByAltText } = render(<BookCard title={book.title} isbn={book.isbn} coverId={book.coverId} />);

        const image = getByAltText(book.title) as HTMLImageElement;
        expect(image.className).toBe('image');
        expect(image.src).toBe(`${BASE_URL}/covers/${book.isbn}`);
    });

    it('should render the placeholder image', () => {
        const book = TEST_BOOKS.harryPotter1;

        const { getByAltText } = render(<BookCard title={book.title} isbn={book.isbn} coverId="" />);

        const image = getByAltText('placeholder') as HTMLImageElement;
        expect(image.className).toBe('image');
        expect(image.src).toBe('http://localhost/placeholder-cover.jpg');
    });

    it('should navigate to BookDetailView on click', () => {
        const book = TEST_BOOKS.harryPotter1;

        const { getByAltText } = renderWithRouter(
            <BookCard title={book.title} isbn={book.isbn} coverId={book.coverId} />
        );

        const image = getByAltText(book.title) as HTMLImageElement;
        expect(history.location.pathname).toBe('/');
        userEvent.click(image);
        expect(history.location.pathname).toBe(`/${book.isbn}`);
    });
});
