import {Paper} from '@material-ui/core';
import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import {Book} from "../types/types";
import axios from "axios";
import moment from "moment";

interface ParamTypes {
    isbn: string;
}

function BookDetailView() {
    const {isbn} = useParams<ParamTypes>();
    const book = useBook(isbn);

    return (
        <Paper>
            <Typography variant="h3">
                {book?.title}
            </Typography>

            <img src={`http://localhost:8080/covers/${book?.isbn}`} alt={book?.title} />
            <p>
                Author: {book?.author}
                <br/>
                Release date: {moment(book?.releaseDate).format("DD.MM.yyyy").toString()}
            </p>
        </Paper>
    );
}

const useBook = (isbn: string) => {
    const [book, setBook] = useState<Book>();

    useEffect(() => {
        const fetchBook = async () => {
            const response = await axios.get(`http://localhost:8080/books/${isbn}`, {});
            setBook(response.data);
            return response.data;
        }
        fetchBook()
        .then((book: Book) => console.log(`Fetched Book '${book.title}'`))
        .catch(e => console.warn(`Could not fetch book with isbn '${isbn}'`, e));
    }, [isbn])
    return book;
}

export default BookDetailView;
