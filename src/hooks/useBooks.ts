import {useState} from 'react';
import {Book, NewBookRequest} from '../types/types';
import {createNewBook, deleteBook as remoteDeleteBook, getAllBooks} from '../bookService';
import {AxiosError} from 'axios';

interface UseBooks {
    books: Book[];
    fetchBooks: () => Promise<void>;
    addBook: (book: NewBookRequest, onSuccess: () => void, onError: (status: number) => void) => Promise<void>;
    deleteBook: (isbn: string, onSuccess: () => void, onError: () => void) => Promise<void>;
}

const useBooks = (): UseBooks => {
    const [books, setBooks] = useState<Book[]>([]);

    const fetchBooks = async () => {
        try {
            const fetchedBooks = await getAllBooks();
            console.info(`Fetched ${fetchedBooks.length} book(s)`);
            setBooks(fetchedBooks);
        } catch (e) {
            console.warn('Could not fetch books', e);
        }
    };

    const addBook = async (
        book: NewBookRequest,
        onSuccess: () => void,
        onError: (responseCode: number) => void
    ): Promise<void> => {
        try {
            const newBook = await createNewBook(book);
            onSuccess();
            setBooks([...books, newBook]);
        } catch (e) {
            const error = e as AxiosError;
            onError(error.response?.status || 0);
        }
    };

    const deleteBook = async (isbn: string, onSuccess: () => void, onError: () => void): Promise<void> => {
        try {
            await remoteDeleteBook(isbn);
            onSuccess();
            setBooks(books.filter((book) => book.isbn !== isbn));
        } catch (e) {
            onError();
        }
    };

    return {
        books,
        fetchBooks,
        addBook,
        deleteBook,
    };
};

export default useBooks;
