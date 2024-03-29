import {Paper} from '@material-ui/core';
import React, {useRef} from 'react';
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

interface ParamTypes {
    isbn: string;
}

const BookDetailView = (): JSX.Element => {
    const {isbn} = useParams<ParamTypes>();
    const {book, setBook, deleteBook, updateCover} = useBook(isbn);
    const history = useHistory();
    const coverInputRef = useRef<HTMLInputElement>(null);

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

    const openFileBrowser = () => {
        coverInputRef.current?.click();
    };

    const handleCoverChange = (files) => {
        void updateCover(files[0]);
    };

    const coverSrc = `/covers/${book.isbn}?${Date.now()}`; // Date.now is added to force the browser to do a new refresh
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
                    <Grid item md={2} sm={4} xs={12} style={{minWidth: '25%'}}>
                        <div className="cover-detail-container">
                            <div className="cover-change-blur" onClick={openFileBrowser}>
                                <p>Change</p>
                            </div>
                            {book.hasCover ? (
                                <img src={coverSrc} alt={book.title} />
                            ) : (
                                <PlaceholderImage title={book.title} />
                            )}
                            <input
                                type="file"
                                data-testid="coverUploadInput"
                                hidden
                                ref={coverInputRef}
                                onChange={(event) => handleCoverChange(event.target.files)}
                            />
                        </div>
                    </Grid>
                    <Grid item md={5} sm={8} xs={12}>
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
