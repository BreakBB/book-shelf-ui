import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import BookCardView, {NO_BOOKS_YET, YOUR_COLLECTION} from './BookCardView';
import {TEST_BOOKS} from '../../testUtils';
import userEvent from '@testing-library/user-event';
import {Book, NewBookRequest} from '../../types/types';
import dayjs from 'dayjs';
import useBooks from '../../hooks/useBooks';

jest.mock('../../hooks/useBooks');

describe('BookCardView', () => {
    const useBooksMock = useBooks as jest.Mock;
    let booksMock: Book[] = [];
    const fetchBooksMock = jest.fn();
    const addBookMock = jest.fn();

    beforeEach(() => {
        useBooksMock.mockImplementation(() => {
            return {
                books: booksMock,
                fetchBooks: fetchBooksMock,
                addBook: addBookMock,
            };
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should render the header', async () => {
        render(<BookCardView />);

        // We need to use waitFor because we have an async call in our component which changes the state
        await waitFor(() => {
            expect(fetchBooksMock).toHaveBeenCalled();
        });
        screen.getByText(YOUR_COLLECTION);
    });

    it('should render the placeholder text without books', async () => {
        render(<BookCardView />);

        await waitFor(() => {
            expect(fetchBooksMock).toHaveBeenCalled();
        });
        screen.getByText(NO_BOOKS_YET);
    });

    it('should render multiple book cards', async () => {
        booksMock = [TEST_BOOKS.harryPotter1, TEST_BOOKS.harryPotter2];

        render(<BookCardView />);

        await waitFor(() => {
            expect(fetchBooksMock).toHaveBeenCalled();
        });
        expect(screen.queryByText(NO_BOOKS_YET)).toBeNull();

        screen.getByRole('img', {name: /harry potter und der stein der weisen/i});
        screen.getByRole('img', {name: /harry potter und die kammer des schreckens/i});
    });

    it('should add a new book', async () => {
        addBookMock.mockImplementation((newBook, onSuccess) => {
            onSuccess();
        });

        render(<BookCardView />);

        await waitFor(() => {
            expect(fetchBooksMock).toHaveBeenCalled();
        });

        insertBook(TEST_BOOKS.harryPotter1);

        await waitFor(() => {
            expect(addBookMock).toHaveBeenCalled();
        });

        expect(screen.queryByText('This book is already in your library')).toBeNull();
        expect(screen.queryByText('Create')).toBeNull();

        expect(await screen.findByAltText('Harry Potter und der Stein der Weisen'));

        expect(screen.queryByText(NO_BOOKS_YET)).toBeNull();
        screen.getByText(YOUR_COLLECTION);
    });

    it('should not add a book that already exists', async () => {
        addBookMock.mockImplementation((newBook, onSuccess, onError) => {
            onError(409);
        });

        render(<BookCardView />);

        await waitFor(() => {
            expect(fetchBooksMock).toHaveBeenCalled();
        });

        insertBook(TEST_BOOKS.harryPotter1);

        await waitFor(() => {
            expect(addBookMock).toHaveBeenCalled();
        });

        expect(screen.getByText('This book is already in your library'));
    });

    const insertBook = (book: NewBookRequest) => {
        const addButton = document.getElementsByClassName('add-book-card')[0];
        userEvent.click(addButton);

        userEvent.type(screen.getByLabelText('Book name'), book.title);
        userEvent.type(screen.getByLabelText('ISBN'), book.isbn);
        userEvent.type(screen.getByLabelText('Author'), book.author);
        const releaseDateInput = screen.getByLabelText('Release Date');
        userEvent.type(releaseDateInput, dayjs(book.releaseDate).format('YYYY-MM-DD'));

        userEvent.click(screen.getByText('Create'));
    };
});
