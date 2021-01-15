import React, {useEffect, useState} from "react";
import {Book, BookResponseData} from "../types/types";
import axios, {AxiosResponse} from "axios";
import {GridList} from "@material-ui/core";
import "./BookCardView.css";
import BookCard from "./BookCard";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

function BookCardView(): JSX.Element {
    const books = useBooks();

    if (books && books.length > 0) {
        return (
            <GridList>
                {books.map((book, index) =>
                    <BookCard key={index} title={book.title} isbn={book.isbn} coverId={book.coverId}/>
                )}
            </GridList>
        );
    } else {
        return (
            <Typography>No Books</Typography>
        );
    }
}

function useBooks(): Book[] {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async (): Promise<number> => {
            const response: AxiosResponse<BookResponseData[]> = await axios.get("http://localhost:8080/books", {});

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
