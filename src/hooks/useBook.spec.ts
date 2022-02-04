import {renderHook} from '@testing-library/react-hooks';
import useBook, {EMPTY_BOOK} from './useBook';
import {act, waitFor} from '@testing-library/react';
import {updateBook, getBook, deleteBook} from '../api/bookApi';
import {TEST_BOOKS} from '../testUtils';

jest.mock('../api/bookApi');

describe('useBook', () => {
    const ISBN = TEST_BOOKS.harryPotter1.isbn;

    const getBookMock = getBook as jest.Mock;
    const updateBookMock = updateBook as jest.Mock;
    const deleteBookMock = deleteBook as jest.Mock;

    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    it('should return an empty book without an isbn', () => {
        const {result} = renderHook(() => useBook(''));
        expect(result.current.book).not.toBe(null);
    });

    it('should fetch and return a book', async () => {
        getBookMock.mockReturnValue(TEST_BOOKS.harryPotter1);

        const {result} = renderHook(() => useBook(ISBN));
        await waitFor(() => {
            expect(getBookMock).toHaveBeenCalled();
        });

        const updatedBook = result.current.book;
        expect(updatedBook).toBeDefined();
        expect(updatedBook.isbn).toBe(TEST_BOOKS.harryPotter1.isbn);
        expect(updatedBook.title).toBe(TEST_BOOKS.harryPotter1.title);
        expect(updatedBook.author).toBe(TEST_BOOKS.harryPotter1.author);
        expect(updatedBook.releaseDate).toBe(TEST_BOOKS.harryPotter1.releaseDate);
    });

    it('should handle error when fetching a book', async () => {
        getBookMock.mockImplementation(() => {
            throw new Error();
        });

        const {result} = renderHook(() => useBook(ISBN));
        await waitFor(() => {
            expect(getBookMock).toHaveBeenCalled();
        });

        expect(result.current.book).toBe(EMPTY_BOOK);
    });

    it('should update a book', async () => {
        getBookMock.mockReturnValue(TEST_BOOKS.harryPotter1);
        updateBookMock.mockReturnValue(TEST_BOOKS.harryPotter2);

        const {result} = renderHook(() => useBook(ISBN));
        await waitFor(() => {
            expect(getBookMock).toHaveBeenCalled();
        });
        await act(() => result.current.setBook(TEST_BOOKS.harryPotter2));
        await waitFor(() => {
            expect(updateBookMock).toHaveBeenCalled();
        });

        const updatedBook = result.current.book;
        expect(updatedBook).toBeDefined();
        expect(updatedBook.isbn).toBe(TEST_BOOKS.harryPotter2.isbn);
        expect(updatedBook.title).toBe(TEST_BOOKS.harryPotter2.title);
        expect(updatedBook.author).toBe(TEST_BOOKS.harryPotter2.author);
        expect(updatedBook.releaseDate).toBe(TEST_BOOKS.harryPotter2.releaseDate);
    });

    it('should delete a book', async () => {
        getBookMock.mockReturnValue(TEST_BOOKS.harryPotter1);

        const {result} = renderHook(() => useBook(ISBN));
        await waitFor(() => {
            expect(getBookMock).toHaveBeenCalled();
        });
        await act(() => result.current.deleteBook(onSuccessMock, onErrorMock));

        expect(onSuccessMock).toHaveBeenCalled();
    });

    it('should call onError callback if book deletion fails', async () => {
        getBookMock.mockReturnValue(TEST_BOOKS.harryPotter1);
        deleteBookMock.mockImplementation(() => {
            throw new Error('deletion failed');
        });

        const {result} = renderHook(() => useBook(ISBN));
        await waitFor(() => {
            expect(getBookMock).toHaveBeenCalled();
        });
        await act(() => result.current.deleteBook(onSuccessMock, onErrorMock));

        expect(onErrorMock).toHaveBeenCalled();
    });
});
