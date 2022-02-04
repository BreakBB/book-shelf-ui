import {screen} from '@testing-library/react';
import {renderWithRouterMatch, TEST_BOOKS} from '../../testUtils';
import BookDetailView from './BookDetailView';
import {history} from '../../history';
import userEvent from '@testing-library/user-event';
import {Book} from '../../types/types';
import useBook, {EMPTY_BOOK} from '../../hooks/useBook';

jest.mock('../../hooks/useBook');

describe('BookCardView', () => {
    const useBookMock = useBook as jest.Mock;
    let bookMock: Book = EMPTY_BOOK;
    const setBookMock = jest.fn();
    const deleteBookMock = jest.fn();

    beforeEach(() => {
        useBookMock.mockImplementation(() => {
            return {
                book: bookMock,
                setBook: setBookMock,
                deleteBook: deleteBookMock,
            };
        });
    });

    afterEach(() => {
        history.push('/books');
        jest.resetAllMocks();
        bookMock = EMPTY_BOOK;
    });

    it('should render the book details', async () => {
        bookMock = TEST_BOOKS.harryPotter1;
        history.push(`/books/${bookMock.isbn}`);

        renderWithRouterMatch(BookDetailView, '/books/:isbn');

        screen.getByText(bookMock.title);
        screen.getByAltText(bookMock.title);
    });

    it('should show "no details" placeholder without a isbn', async () => {
        renderWithRouterMatch(BookDetailView, '/');

        screen.getByText('No Details');
    });

    it('should show "no details" placeholder for invalid ISBN', async () => {
        history.push('/books/123invalid');

        renderWithRouterMatch(BookDetailView, '/books/:isbn');

        screen.getByText('No Details');
    });

    it('should navigate to book overview on back button click', async () => {
        bookMock = TEST_BOOKS.harryPotter1;
        history.push(`/books/${bookMock.isbn}`);

        renderWithRouterMatch(BookDetailView, '/books/:isbn');

        const allButtons = screen.getAllByRole('button');

        userEvent.click(allButtons[0]);

        expect(history.location.pathname).toBe('/books');
    });

    it('should navigate to book overview on book deletion', async () => {
        bookMock = TEST_BOOKS.harryPotter1;
        deleteBookMock.mockImplementation((onSuccess) => {
            onSuccess();
        });
        history.push(`/books/${bookMock.isbn}`);

        renderWithRouterMatch(BookDetailView, '/books/:isbn');

        const deleteButton = screen.getByRole('button', {name: /Delete Book/i});
        userEvent.click(deleteButton);

        expect(deleteBookMock).toHaveBeenCalled();

        expect(history.location.pathname).toBe('/books');
    });

    it('should handle title changes', () => {
        bookMock = TEST_BOOKS.harryPotter1;
        history.push(`/books/${bookMock.isbn}`);

        renderWithRouterMatch(BookDetailView, '/books/:isbn');

        const editButton = screen.getAllByTestId('editButton');
        userEvent.click(editButton[0]);

        const titleInput = screen.getByDisplayValue(bookMock.title);
        userEvent.clear(titleInput);
        userEvent.type(titleInput, 'AAA');

        const editDoneButton = screen.getAllByTestId('editDoneButton');
        userEvent.click(editDoneButton[0]);
        expect(setBookMock).toHaveBeenLastCalledWith({...bookMock, title: 'AAA'});
    });
});
