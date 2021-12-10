import {Book} from '../types/types';
import {useEffect, useState} from 'react';
import {deleteBook as remoteDeleteBook, updateBook as remoteUpdateBook, getBook} from '../bookService';

interface UseBook {
    book: Book;
    setBook: (Book) => Promise<void>;
    deleteBook: (onSuccess: () => void, onError: () => void) => Promise<void>;
}

export const EMPTY_BOOK: Book = {
    author: '',
    isbn: '',
    releaseDate: '',
    title: '',
};

const useBook = (isbn: string): UseBook => {
    const [book, setBook] = useState<Book>(EMPTY_BOOK);

    const updateBook = async (updatedBook: Book): Promise<void> => {
        const bookResponse = await remoteUpdateBook(isbn, updatedBook);
        setBook(bookResponse);
    };

    const deleteBook = async (onSuccess: () => void, onError: () => void): Promise<void> => {
        try {
            await remoteDeleteBook(isbn);
            onSuccess();
        } catch (e) {
            onError();
        }
    };

    useEffect(() => {
        if (!isbn) {
            return;
        }
        const fetchBook = async (): Promise<Book> => {
            const book = await getBook(isbn);
            setBook(book);

            return book;
        };
        fetchBook()
            .then((book: Book) => console.log(`Fetched Book '${book.title}'`))
            .catch((e) => console.warn(`Could not fetch book with isbn '${isbn}'`, e));
    }, [isbn]);
    return {book, setBook: updateBook, deleteBook};
};

export default useBook;
