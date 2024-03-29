import React from 'react';
import {Dialog, DialogContent, DialogTitle} from '@material-ui/core';
import './NewBookModal.css';
import FormInput from './FormInput';
import {NewBookRequest} from '../../../types/types';
import dayjs from 'dayjs';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface Props {
    onSubmit: (book: NewBookRequest) => void;
    onClose: () => void;
    bookAlreadyExists: boolean;
}

const NewBookModal = (props: Props): JSX.Element => {
    const handleSubmit = (event) => {
        event.preventDefault();

        const {title, isbn, author, releaseDate} = event.target.elements;

        const isValid = isValidBookRequest(title.value, isbn.value, author.value, releaseDate.value);

        if (isValid) {
            props.onSubmit({
                title: title.value,
                isbn: isbn.value,
                author: author.value,
                releaseDate: dayjs(releaseDate.value).format('YYYY-MM-DD'),
            });
        }
    };

    return (
        <Dialog open={true} onClose={props.onClose}>
            <DialogTitle disableTypography className="dialogTitle">
                <h3>Add a new book</h3>
                <IconButton onClick={props.onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {props.bookAlreadyExists && <span className="error-message">This book is already in your library</span>}
                <form className="form-block" onSubmit={handleSubmit}>
                    <FormInput label="Book name" name="title" />
                    <FormInput label="ISBN" name="isbn" />
                    <FormInput label="Author" name="author" />
                    <FormInput label="Release Date" name="releaseDate" type="date" />
                    <div style={{width: '100%', display: 'flex'}}>
                        <button type="submit" className="create-button">
                            Create
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const isValidBookRequest = (title: string, isbn: string, author: string, releaseDate: string): boolean => {
    return !(!title || !isbn || !author || !releaseDate);
};

export default NewBookModal;
