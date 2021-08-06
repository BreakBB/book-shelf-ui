import {Paper} from '@material-ui/core';
import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom';
import {Book} from "../types/types";
import Grid from '@material-ui/core/Grid/Grid';
import "./BookDetailView.css";
import {toast} from "react-toastify";
import MetaDataBlock from "./MetaDataBlock";
import {EditableInput} from '../ComponentLib/EditableInput';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton";
import {BASE_URL, deleteBook, getBook, updateBook} from "../bookService";
import {PlaceholderImage} from "../BookCardView/PlaceholderImage/PlaceholderImage";

interface ParamTypes {
    isbn: string;
}

function BookDetailView(): JSX.Element {
    const {isbn} = useParams<ParamTypes>();
    const [book, setBook] = useBook(isbn);
    const history = useHistory();

    const handleClick = () => {
        try {
            void deleteBook(isbn);
            toast.success(`Successfully removed '${book?.title}'`);
            history.push("/")
        } catch (e) {
            toast.error("Failed to delete the book");
        }
    }

    const handleTitleChange = async (newTitle: string) => {
        if (book !== undefined) {
            book.title = newTitle;
            await updateBook(book.isbn, book, setBook)
        }
    };

    return (
        <Paper className="book-detail-paper">
            <IconButton onClick={() => history.push("/")}>
                <ArrowBackIcon/>
            </IconButton>
            {
                book ? (
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12}>
                            <EditableInput text={book.title} header onChangeDone={handleTitleChange}/>
                        </Grid>
                        <Grid item md={2} xs={12}>
                            {
                                book.coverId ?
                                    <img src={`${BASE_URL}/covers/${book.isbn}`} alt={book.title}/> :
                                    <PlaceholderImage title={book.title}/>
                            }
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <MetaDataBlock book={book} handleBookUpdate={setBook}/>
                            <div style={{float: "right", marginTop: "1rem"}}>
                                <button className="delete-button" onClick={handleClick}>Delete Book</button>
                            </div>
                        </Grid>
                    </Grid>
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
            const book = await getBook(isbn);
            setBook(book);

            return book;
        }
        fetchBook()
        .then((book: Book) => console.log(`Fetched Book '${book.title}'`))
        .catch(e => console.warn(`Could not fetch book with isbn '${isbn}'`, e));
    }, [isbn])
    return [book, setBook];
}

export default BookDetailView;
