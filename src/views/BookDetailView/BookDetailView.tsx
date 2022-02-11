import {Paper} from '@material-ui/core';
import React, {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import Grid from '@material-ui/core/Grid/Grid';
import './BookDetailView.css';
import {toast} from 'react-toastify';
import MetaDataBlock from './MetaDataBlock';
import {EditableInput} from '../../components/EditableInput/EditableInput';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import {PlaceholderImage} from '../BookCardView/PlaceholderImage/PlaceholderImage';
import useBook from '../../hooks/useBook';
import {Book} from '../../types/types';
import {log} from 'util';

interface ParamTypes {
    isbn: string;
}

const BookDetailView = (): JSX.Element => {
    const [showCoverChange, setShowCoverChange] = useState<boolean>(false);

    const {isbn} = useParams<ParamTypes>();
    const {book, setBook, deleteBook} = useBook(isbn);
    const history = useHistory();

    const handleDeleteClick = () => {
        void deleteBook(
            () => {
                toast.success(`Successfully removed book: '${book?.title}'`);
                history.push('/books');
            },
            () => {
                toast.error(`Failed to delete book: '${book?.title}'`);
            }
        );
    };

    const handleTitleChange = (newTitle: string) => {
        book.title = newTitle;
        void setBook(book);
    };

    return (
        <Paper className="book-detail-paper">
            <IconButton onClick={() => history.push('/books')}>
                <ArrowBackIcon />
            </IconButton>
            {book.isbn ? (
                <Grid container spacing={2}>
                    <Grid item md={12} xs={12}>
                        <EditableInput text={book.title} header onChangeDone={handleTitleChange} />
                    </Grid>
                    <Grid item md={2} xs={12}>
                        {book.coverId ? (
                            <img
                                onMouseEnter={() => setShowCoverChange(true)}
                                onMouseLeave={() => setShowCoverChange(false)}
                                src={`/covers/${book.isbn}`}
                                alt={book.title}
                            />
                        ) : (
                            <PlaceholderImage
                                title={book.title}
                                onEnter={() => setShowCoverChange(true)}
                                onLeave={() => setShowCoverChange(false)}
                            />
                        )}
                        <button className={`cover-button${showCoverChange ? ' show' : ''}`}>Change</button>
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
