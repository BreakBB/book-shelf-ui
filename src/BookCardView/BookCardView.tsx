import React, {useEffect, useState} from 'react';
import {NewBookRequest} from '../types/types';
import './BookCardView.css';
import BookCard from './BookCard/BookCard';
import AddIcon from '@material-ui/icons/Add';
import useTheme from '@material-ui/core/styles/useTheme';
import NewBookModal from './NewBookModal/NewBookModal';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useBooks from '../hooks/useBooks';
import {AxiosError} from 'axios';

export const NO_BOOKS_YET = "You don't have any books in your Collection yet. Go ahead and add some!";
export const YOUR_COLLECTION = 'Your Collection';

function BookCardView(): JSX.Element {
    const [books, setBooks] = useState<Book[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [bookAlreadyExists, setBookAlreadyExists] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const fetchBooks = async (): Promise<number> => {
            const books = await getAllBooks();

            setBooks(books);
            return books.length;
        };
        fetchBooks()
            .then((length) => console.info(`Fetched ${length} book(s)`))
            .catch((e) => console.warn('Could not fetch books', e));
    }, []);

    const handleNewBookSubmit = (newBook: NewBookRequest) => {
        createNewBook(newBook)
            .then((book: Book) => {
                toast.success('A new book was added');
                setBooks([...books, book]);
                setBookAlreadyExists(false);
            })
            .catch((e: AxiosError) => {
                if (e.response?.status === 409) {
                    setBookAlreadyExists(true);
                    return;
                }

                toast.error('The new book could not be added');
            });
    };

    return (
        <>
            <h1 className="title">{YOUR_COLLECTION}</h1>
            {books.length === 0 && <p>{NO_BOOKS_YET}</p>}
            <ul className="grid-list">
                {books.map((book, index) => (
                    <BookCard key={index} title={book.title} isbn={book.isbn} coverId={book.coverId} />
                ))}
                <li
                    onClick={() => setShowModal(true)}
                    className="book-card hover-grow add-book-card"
                    style={{color: theme.palette.secondary.main}}
                >
                    <AddIcon className="placeholder-image-text" style={{fontSize: 90}} />
                </li>
            </ul>
            <NewBookModal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setBookAlreadyExists(false);
                }}
                onSubmit={handleNewBookSubmit}
                bookAlreadyExists={bookAlreadyExists}
            />
        </>
    );
}

export default BookCardView;
