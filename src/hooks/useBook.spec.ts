import {renderHook} from '@testing-library/react-hooks';
import useBook from './useBook';
import {act, waitFor} from '@testing-library/react';
import {updateBook, getBook, deleteBook} from '../bookService';
import {TEST_BOOKS} from '../testUtils';

jest.mock('../bookService');

describe('useBook', () => {
    const ISBN = TEST_BOOKS.harryPotter1.isbn;

    const getBookMock = getBook as jest.Mock;
    const updateBookMock = updateBook as jest.Mock;
    const deleteBookMock = deleteBook as jest.Mock;

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
        const onSuccessMock = jest.fn();

        const {result} = renderHook(() => useBook(ISBN));
        await waitFor(() => {
            expect(getBookMock).toHaveBeenCalled();
        });
        await act(() => result.current.deleteBook(onSuccessMock, () => {}));

        expect(onSuccessMock).toHaveBeenCalled();
    });

    it('should call onError callback if book deletion fails', async () => {
        getBookMock.mockReturnValue(TEST_BOOKS.harryPotter1);
        deleteBookMock.mockImplementation(() => {
            throw new Error('deletion failed');
        });
        const onErrorMock = jest.fn();

        const {result} = renderHook(() => useBook(ISBN));
        await waitFor(() => {
            expect(getBookMock).toHaveBeenCalled();
        });
        await act(() => result.current.deleteBook(() => {}, onErrorMock));

        expect(onErrorMock).toHaveBeenCalled();
    });
});
