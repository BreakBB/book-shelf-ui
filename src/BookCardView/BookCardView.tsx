import React, {useEffect, useState} from "react";
import {Book, BookResponseData, NewBookRequest} from "../types/types";
import axios, {AxiosResponse} from "axios";
import "./BookCardView.css";
import BookCard from "./BookCard/BookCard";
import AddIcon from "@material-ui/icons/Add";
import useTheme from "@material-ui/core/styles/useTheme";
import NewBookModal from "./NewBookModal/NewBookModal";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {toBook} from "../utils";

export const NO_BOOKS_YET = "You don't have any books in your Collection yet. Go ahead and add some!";
export const YOUR_COLLECTION = "Your Collection";

function BookCardView(): JSX.Element {
    const books = useBooks();
    const [showModal, setShowModal] = useState(false);
    const theme = useTheme();

    const handleNewBookSubmit = (newBook: NewBookRequest) => {
        postNewBookData(newBook)
        .then(() => {
            toast.success("A new book was added");
        })
        .catch(() => {
            toast.error("The new book could not be added");
        })
    }

    const postNewBookData = async (newBook: NewBookRequest) => {
        await axios.post("http://localhost:8080/books", newBook);
    }

    return (
        <>
            <h1 className="title">
                {YOUR_COLLECTION}
            </h1>
            {(books.length === 0) && (
                <p>{NO_BOOKS_YET}</p>
            )}
            <ul className="grid-list">
                {
                    books.map((book, index) =>
                        <BookCard key={index} title={book.title} isbn={book.isbn} coverId={book.coverId}/>
                    )
                }
                <li onClick={() => setShowModal(true)} className="book-card hover-grow add-book-card"
                    style={{color: theme.palette.secondary.main}}>
                    <AddIcon className="placeholder-image-text" style={{fontSize: 90}}/>
                </li>
            </ul>
            <NewBookModal show={showModal} onClose={() => setShowModal(false)} onSubmit={handleNewBookSubmit}/>
        </>
    );
}

function useBooks(): Book[] {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async (): Promise<number> => {
            const response: AxiosResponse<BookResponseData[]> = await axios.get("http://localhost:8080/books");

            const books = transformReleaseDates(response.data);

            setBooks(books);
            return books.length;
        }
        fetchBooks()
        .then((length) => console.info(`Fetched ${length} book(s)`))
        .catch(e => console.warn("Could not fetch books", e));
    }, [])
    return books;
}

function transformReleaseDates(responseData: BookResponseData[]) {
    return responseData.map((bookData): Book => {
        return toBook(bookData);
    });
}

export default BookCardView;
