import React, {useEffect, useState} from "react";
import {Book, BookResponseData} from "../types/types";
import axios, {AxiosResponse} from "axios";
import "./BookCardView.css";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import BookCard from "./BookCard/BookCard";

export const NO_BOOKS_YET = "You don't have any books in your Collection yet.";
export const YOUR_COLLECTION = "Your Collection";

function BookCardView(): JSX.Element {
    const books = useBooks();

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
            </ul>
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
