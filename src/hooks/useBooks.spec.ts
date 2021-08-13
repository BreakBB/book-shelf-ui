import {renderHook} from '@testing-library/react-hooks';
import useBooks from './useBooks';
import {act} from '@testing-library/react';
import {createNewBook, getAllBooks} from '../bookService';
import {TEST_BOOKS} from '../testUtils';

jest.mock('../bookService');

describe('useBooks', () => {
    const getAllBooksMock = getAllBooks as jest.Mock;
    const createNewBookMock = createNewBook as jest.Mock;

    it('should initially return no books', () => {
        const {result} = renderHook(() => useBooks());

        expect(result.current.books.length).toBe(0);
    });

    it('should fetch and return books', async () => {
        getAllBooksMock.mockReturnValue([TEST_BOOKS.harryPotter1]);

        const {result} = renderHook(() => useBooks());
        await act(() => result.current.fetchBooks());

        expect(result.current.books.length).toBe(1);
        expect(result.current.books[0]).toBe(TEST_BOOKS.harryPotter1);
    });

    it('should add a new book', async () => {
        createNewBookMock.mockReturnValue(TEST_BOOKS.harryPotter1);

        const {result} = renderHook(() => useBooks());

        expect(result.current.books.length).toBe(0);
        await act(() =>
            result.current.addBook(
                TEST_BOOKS.harryPotter1,
                () => {},
                () => {}
            )
        );
        expect(result.current.books.length).toBe(1);
        expect(result.current.books[0]).toBe(TEST_BOOKS.harryPotter1);
    });

    it('should delete a book', async () => {
        getAllBooksMock.mockReturnValue([TEST_BOOKS.harryPotter1, TEST_BOOKS.harryPotter2]);

        const {result} = renderHook(() => useBooks());
        await act(() => result.current.fetchBooks());

        expect(result.current.books.length).toBe(2);
        await act(() =>
            result.current.deleteBook(
                TEST_BOOKS.harryPotter1.isbn,
                () => {},
                () => {}
            )
        );
        expect(result.current.books.length).toBe(1);
        expect(result.current.books[0]).toBe(TEST_BOOKS.harryPotter2);
    });
});
