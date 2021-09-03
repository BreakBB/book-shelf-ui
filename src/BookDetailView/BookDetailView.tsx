import {Paper} from '@material-ui/core';
import React from 'react';
import {useHistory, useParams} from 'react-router-dom';
import Grid from '@material-ui/core/Grid/Grid';
import './BookDetailView.css';
import {toast} from 'react-toastify';
import MetaDataBlock from './MetaDataBlock';
import {EditableInput} from '../ComponentLib/EditableInput';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import {BASE_URL} from '../bookService';
import {PlaceholderImage} from '../BookCardView/PlaceholderImage/PlaceholderImage';
import useBook from '../hooks/useBook';
import {Book} from '../types/types';

interface ParamTypes {
    isbn: string;
}

const BookDetailView = (): JSX.Element => {
    const {isbn} = useParams<ParamTypes>();
    const {book, setBook, deleteBook} = useBook(isbn);
    const history = useHistory();

    const handleDeleteClick = () => {
        void deleteBook(
            () => {
                toast.success(`Successfully removed '${book?.title}'`);
                history.push('/');
            },
            () => {
                toast.error('Failed to delete the book');
            }
        );
    };

    const handleTitleChange = (newTitle: string) => {
        if (book !== undefined) {
            book.title = newTitle;
            void setBook(book);
        }
    };

    return (
        <Paper className="book-detail-paper">
            <IconButton onClick={() => history.push('/')}>
                <ArrowBackIcon />
            </IconButton>
            {book.isbn ? (
                <Grid container spacing={2}>
                    <Grid item md={12} xs={12}>
                        <EditableInput text={book.title} header onChangeDone={handleTitleChange} />
                    </Grid>
                    <Grid item md={2} xs={12}>
                        {book.coverId ? (
                            <img src={`${BASE_URL}/covers/${book.isbn}`} alt={book.title} />
                        ) : (
                            <PlaceholderImage title={book.title} />
                        )}
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <MetaDataBlock
                            book={book}
                            onChange={(updatedBook: Book) => {
                                void setBook(updatedBook);
                            }}
                        />
                        <div style={{float: 'right', marginTop: '1rem'}}>
                            <button className="delete-button" onClick={handleDeleteClick}>
                                Delete Book
                            </button>
                        </div>
                    </Grid>
                </Grid>
            ) : (
                <p>No Details</p>
            )}
        </Paper>
    );
};

export default BookDetailView;
