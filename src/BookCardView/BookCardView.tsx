import React, {useEffect, useState} from "react";
import {Book, BookResponseData} from "../types/types";
import axios, {AxiosResponse} from "axios";
import "./BookCardView.css";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import BookCard from "./BookCard/BookCard";
import AddIcon from "@material-ui/icons/Add";
import useTheme from "@material-ui/core/styles/useTheme";
import NewBookModal from "./NewBookModal/NewBookModal";

export const NO_BOOKS_YET = "You don't have any books in your Collection yet.";
export const YOUR_COLLECTION = "Your Collection";

function BookCardView(): JSX.Element {
    const books = useBooks();
    const [showModal, setShowModal] = useState(false);
    const theme = useTheme();

    const handleNewBookSubmit = (data) => {
        console.log("DATA", data);
    }

    return (
        <>
            <Typography className="title" variant="h3">
                {YOUR_COLLECTION}
            </Typography>
            {(books.length === 0) && (
                <Typography variant="h6" style={{marginBottom: 10}}>{NO_BOOKS_YET}</Typography>
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
        return {
            ...bookData,
            releaseDate: moment(bookData.releaseDate, "DD.MM.yyyy")
        }
    });
}

export default BookCardView;
