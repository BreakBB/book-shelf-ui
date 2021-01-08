import React, {useEffect, useState} from "react";
import {Book} from "../types/types";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import {GridList} from "@material-ui/core";

export default function BookOverview() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/books", {});
                setBooks(response.data);
                return response.data.length;
            } catch (e) {
                console.warn("Could not read the books", e)
                return 0;
            }
        }
        fetchBooks().then((length) => console.info(`Fetched ${length} book(s)`));
    }, [])

    return (
        <GridList>
            {books.map(book => <BookCard isbn={book.isbn} title={book.title} author={book.author}/>)}
        </GridList>
    );
}
