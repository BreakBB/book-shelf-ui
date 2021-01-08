import React, {useEffect, useState} from "react";
import {Book} from "../types/types";
import axios from "axios";
import {GridList} from "@material-ui/core";
import "./BookCardView.css";
import BookCard from "./BookCard";

function BookCardView() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/books", {});
                setBooks(response.data);
                return response.data.length;
            } catch (e) {
                console.warn("Could not fetch books", e)
                return 0;
            }
        }
        fetchBooks().then((length) => console.info(`Fetched ${length} book(s)`));
    }, [])

    return (
        <GridList>
            {books.map(book =>
                <BookCard title={book.title} isbn={book.isbn} coverId={book.coverId}/>
            )}
        </GridList>
    );
}

export default BookCardView;
