import React, {useEffect, useState} from 'react';
import {NewBookRequest} from '../../types/types';
import './BookCardView.css';
import BookCard from './BookCard/BookCard';
import AddIcon from '@material-ui/icons/Add';
import NewBookModal from './NewBookModal/NewBookModal';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useBooks from '../../hooks/useBooks';

export const NO_BOOKS_YET = "You don't have any books in your Collection yet. Go ahead and add some!";
export const YOUR_COLLECTION = 'Your Collection';

const BookCardView = (): JSX.Element => {
    const {books, fetchBooks, addBook} = useBooks();
    const [showModal, setShowModal] = useState(false);
    const [bookAlreadyExists, setBookAlreadyExists] = useState(false);

    useEffect(() => {
        void fetchBooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNewBookSubmit = (newBook: NewBookRequest) => {
        void addBook(
            newBook,
            () => {
                toast.success('A new book was added');
                setShowModal(false);
            },
            (status: number) => {
                if (status === 409) {
                    console.log('showModal', showModal);
                    console.log('bookAlreadyExists', bookAlreadyExists);
                    setBookAlreadyExists(true);
                    return;
                }
                toast.error('The new book could not be added');
            }
        );
    };

    console.log('r showModal', showModal);
    console.log('r bookAlreadyExists', bookAlreadyExists);

    return (
        <>
            <h1 className="title">{YOUR_COLLECTION}</h1>
            {books.length === 0 && <p>{NO_BOOKS_YET}</p>}
            <ul className="grid-list">
                {books.map((book, index) => (
                    <BookCard key={index} title={book.title} isbn={book.isbn} hasCover={book.hasCover} />
                ))}
                <li onClick={() => setShowModal(true)} className="book-card hover-grow add-book-card">
                    <AddIcon className="add-icon" style={{fontSize: 90}} />
                </li>
            </ul>
            {showModal && (
                <NewBookModal
                    onSubmit={handleNewBookSubmit}
                    onClose={() => {
                        setShowModal(false);
                        setBookAlreadyExists(false);
                    }}
                    bookAlreadyExists={bookAlreadyExists}
                />
            )}
        </>
    );
};

export default BookCardView;
