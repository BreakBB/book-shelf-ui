import {Button, Paper} from '@material-ui/core';
import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom';
import {Book, BookResponseData} from "../types/types";
import axios, {AxiosResponse} from "axios";
import Grid from '@material-ui/core/Grid/Grid';
import MetaDataBlock from "./MetaDataBlock/MetaDataBlock";
import "./BookDetailView.css";
import {toast} from "react-toastify";
import {toBook} from "../utils";

interface ParamTypes {
    isbn: string;
}

function BookDetailView(): JSX.Element {
    const {isbn} = useParams<ParamTypes>();
    const [book, setBook] = useBook(isbn);
    const history = useHistory();

    const deleteBook = async () => {
        try {
            await axios.delete(`http://localhost:8080/books/${isbn}`);
            toast.success("Successfully removed the book");
            history.push("/")
        } catch (e) {
            toast.error("Failed to delete the book");
        }
    }

    return (
        <Paper className="book-detail-paper">
            {
                book ? (
                    <div className="book-detail">
                        <h1 className="title">
                            {book.title}
                        </h1>
                        <Grid container spacing={2}>
                            <Grid item md={2} xs={12}>
                                <img src={`http://localhost:8080/covers/${book.isbn}`} alt={book.title}/>
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <MetaDataBlock book={book} handleBookUpdate={(book: BookResponseData) => setBook(toBook(book))}/>
                                <div style={{float: "right", marginTop: "1rem"}}>
                                    <Button variant="outlined" onClick={deleteBook}>Delete Book</Button>
                                </div>
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

const useBook = (isbn: string): [Book | undefined, (Book) => void] => {
    const [book, setBook] = useState<Book>();

    useEffect(() => {
        const fetchBook = async (): Promise<Book> => {
            if (isbn === undefined) {
                throw Error("Given isbn is undefined");
            }

            const response: AxiosResponse<BookResponseData> = await axios.get(`http://localhost:8080/books/${isbn}`);

            if (response.data) {
                const book = toBook(response.data);
                setBook(book);
                return book;
            }
            throw Error("No response data");
        }
        fetchBook()
        .then((book: Book) => console.log(`Fetched Book '${book.title}'`))
        .catch(e => console.warn(`Could not fetch book with isbn '${isbn}'`, e));
    }, [isbn])
    return [book, setBook];
}

export default BookDetailView;
