import {Book} from '../types/types';
import {useEffect, useState} from 'react';
import bookApi from '../api/bookApi';

interface UseBook {
    book: Book;
    setBook: (book: Book) => Promise<void>;
    deleteBook: (onSuccess: () => void, onError: () => void) => Promise<void>;
    updateCover: (cover: File) => Promise<void>;
}

export const EMPTY_BOOK: Book = {
    author: '',
    isbn: '',
    releaseDate: '',
    title: '',
    hasCover: false,
};

const useBook = (isbn: string): UseBook => {
    const [book, setBook] = useState<Book>(EMPTY_BOOK);

    const updateBook = async (updatedBook: Book): Promise<void> => {
        const bookResponse = await bookApi.updateBook(isbn, updatedBook);
        setBook(bookResponse);
    };

    const updateCover = async (cover: File): Promise<void> => {
        const uploadSuccessful = await bookApi.updateCover(isbn, cover);
        setBook({...book, hasCover: uploadSuccessful});
    };

    const deleteBook = async (onSuccess: () => void, onError: () => void): Promise<void> => {
        try {
            await bookApi.deleteBook(isbn);
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
            const book = await bookApi.getBook(isbn);
            setBook(book);

            return book;
        };
        fetchBook()
            .then((book: Book) => console.log(`Fetched Book '${book.title}'`))
            .catch((e) => console.warn(`Could not fetch book with isbn '${isbn}'`, e));
    }, [isbn]);
    return {book, setBook: updateBook, deleteBook, updateCover};
};

export default useBook;
