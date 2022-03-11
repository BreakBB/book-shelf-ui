import apiClient from './apiClient';
import bookApi from './bookApi';
import {TEST_BOOKS} from '../testUtils';

jest.mock('./apiClient');

describe('bookService', () => {
    const apiClientGetMock = apiClient.get as jest.Mock;
    const apiClientPostMock = apiClient.post as jest.Mock;
    const apiClientDeleteMock = apiClient.delete as jest.Mock;
    const apiClientPutMock = apiClient.put as jest.Mock;

    it('should getAllBooks', async () => {
        apiClientGetMock.mockReturnValue({
            data: 'test',
        });

        const result = await bookApi.getAllBooks();

        expect(apiClientGetMock).toHaveBeenLastCalledWith('/books');
        expect(result).toBe('test');
    });

    it('should getBook', async () => {
        apiClientGetMock.mockReturnValue({
            data: 'test',
        });

        const result = await bookApi.getBook('123');

        expect(apiClientGetMock).toHaveBeenLastCalledWith('/books/123');
        expect(result).toBe('test');
    });

    it('should createNewBook', async () => {
        apiClientPostMock.mockReturnValue({
            data: 'test',
        });

        const result = await bookApi.createNewBook(TEST_BOOKS.harryPotter1);

        expect(apiClientPostMock).toHaveBeenLastCalledWith('/books', TEST_BOOKS.harryPotter1);
        expect(result).toBe('test');
    });

    it('should deleteBook', async () => {
        await bookApi.deleteBook('123');

        expect(apiClientDeleteMock).toHaveBeenLastCalledWith('/books/123');
    });

    it('should updateBook', async () => {
        apiClientPutMock.mockReturnValue({
            data: 'test',
        });
        const result = await bookApi.updateBook('123', TEST_BOOKS.harryPotter1);

        expect(apiClientPutMock).toHaveBeenLastCalledWith('/books/123', TEST_BOOKS.harryPotter1);
        expect(result).toBe('test');
    });
});
