import {Paper} from '@material-ui/core';
import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import {Book, BookResponseData} from "../types/types";
import axios, {AxiosResponse} from "axios";
import Grid from '@material-ui/core/Grid/Grid';
import MetaDataBlock from "./MetaDataBlock/MetaDataBlock";
import "./BookDetailView.css";
import moment from "moment";

interface ParamTypes {
    isbn: string;
}

function BookDetailView(): JSX.Element {
    const {isbn} = useParams<ParamTypes>();
    const book = useBook(isbn);

    return (
        <Paper className="book-detail-paper">
            {
                book ? (
                    <div className="book-detail">
                        <Typography className="title" variant="h3">
                            {book.title}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item md={2}>
                                <img src={`http://localhost:8080/covers/${book.isbn}`} alt={book.title}/>
                            </Grid>
                            <Grid item md={3}>
                                <MetaDataBlock book={book}/>
                            </Grid>
                        </Grid>
                    </div>
                ) : <p>
                    No Details
                </p>
            }
        </Paper>
    );
}

const useBook = (isbn: string): Book | undefined => {
    const [book, setBook] = useState<Book>();

    useEffect(() => {
        const fetchBook = async (): Promise<Book> => {
            if (isbn === undefined) {
                throw Error("Given isbn is undefined");
            }

            const response: AxiosResponse<BookResponseData> = await axios.get(`http://localhost:8080/books/${isbn}`);

            if (response.data) {
                const book: Book = {
                    ...response.data,
                    releaseDate: moment(response.data.releaseDate, "DD.MM.yyyy")
                }

                setBook(book);
                return book;
            }
            throw Error("No response data");
        }
        fetchBook()
        .then((book: Book) => console.log(`Fetched Book '${book.title}'`))
        .catch(e => console.warn(`Could not fetch book with isbn '${isbn}'`, e));
    }, [isbn])
    return book;
}

export default BookDetailView;
