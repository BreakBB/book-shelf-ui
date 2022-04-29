import {renderHook} from '@testing-library/react-hooks';
import useBooks from './useBooks';
import {act} from '@testing-library/react';
import bookApi from '../api/bookApi';
import {TEST_BOOKS} from '../testUtils';

jest.mock('../api/bookApi');

describe('useBooks', () => {
    const getAllBooksMock = bookApi.getAllBooks as jest.Mock;
    const createNewBookMock = bookApi.createNewBook as jest.Mock;
    const remoteDeleteBookMock = bookApi.deleteBook as jest.Mock;

    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should initially return no books', () => {
        const {result} = renderHook(() => useBooks());

        expect(result.current.books.length).toBe(0);
    });

    describe('fetchBooks', () => {
        it('should fetch and return books', async () => {
            getAllBooksMock.mockReturnValue([TEST_BOOKS.harryPotter1]);

            const {result} = renderHook(() => useBooks());
            await act(() => result.current.fetchBooks());

            expect(getAllBooksMock).toHaveBeenCalled();
            expect(result.current.books.length).toBe(1);
            expect(result.current.books[0]).toBe(TEST_BOOKS.harryPotter1);
        });

        it('should handle errors', async () => {
            getAllBooksMock.mockImplementation(() => {
                throw new Error();
            });

            const {result} = renderHook(() => useBooks());
            await act(() => result.current.fetchBooks());

            expect(getAllBooksMock).toHaveBeenCalled();
            expect(result.current.books.length).toBe(0);
        });
    });

    describe('addBook', () => {
        it('should add a new book', async () => {
            createNewBookMock.mockReturnValue(TEST_BOOKS.harryPotter1);

            const {result} = renderHook(() => useBooks());

            expect(result.current.books.length).toBe(0);

            await act(() => result.current.addBook(TEST_BOOKS.harryPotter1, onSuccessMock, onErrorMock));

            expect(createNewBookMock).toHaveBeenCalled();
            expect(onSuccessMock).toHaveBeenCalled();
            expect(onErrorMock).not.toHaveBeenCalled();
            expect(result.current.books.length).toBe(1);
            expect(result.current.books[0]).toBe(TEST_BOOKS.harryPotter1);
        });

        it('should call onError handler', async () => {
            createNewBookMock.mockImplementation(() => {
                throw new Error();
            });

            const {result} = renderHook(() => useBooks());

            expect(result.current.books.length).toBe(0);

            await act(() => result.current.addBook(TEST_BOOKS.harryPotter1, onSuccessMock, onErrorMock));

            expect(createNewBookMock).toHaveBeenCalled();
            expect(onSuccessMock).not.toHaveBeenCalled();
            expect(onErrorMock).toHaveBeenCalled();
            expect(result.current.books.length).toBe(0);
        });
    });

    describe('deleteBook', () => {
        it('should delete a book', async () => {
            getAllBooksMock.mockReturnValue([TEST_BOOKS.harryPotter1, TEST_BOOKS.harryPotter2]);

            const {result} = renderHook(() => useBooks());
            await act(() => result.current.fetchBooks());

            expect(result.current.books.length).toBe(2);
            await act(() => result.current.deleteBook(TEST_BOOKS.harryPotter1.isbn, onSuccessMock, onErrorMock));

            expect(remoteDeleteBookMock).toHaveBeenLastCalledWith(TEST_BOOKS.harryPotter1.isbn);
            expect(onSuccessMock).toHaveBeenCalled();
            expect(onErrorMock).not.toHaveBeenCalled();
            expect(result.current.books.length).toBe(1);
            expect(result.current.books[0]).toBe(TEST_BOOKS.harryPotter2);
        });

        it('should call onError handler', async () => {
            getAllBooksMock.mockReturnValueOnce([TEST_BOOKS.harryPotter1, TEST_BOOKS.harryPotter2]);
            remoteDeleteBookMock.mockImplementationOnce(() => {
                throw new Error();
            });

            const {result} = renderHook(() => useBooks());
            await act(() => result.current.fetchBooks());
            await act(() => result.current.deleteBook(TEST_BOOKS.harryPotter1.isbn, onSuccessMock, onErrorMock));

            expect(remoteDeleteBookMock).toHaveBeenLastCalledWith(TEST_BOOKS.harryPotter1.isbn);
            expect(onSuccessMock).not.toHaveBeenCalled();
            expect(onErrorMock).toHaveBeenCalled();
            expect(result.current.books.length).toBe(2);
        });
    });
});
