import React from 'react';
import {Dayjs} from 'dayjs';
import DataRow from './DataRow/DataRow';
import DateDataRow from './DataRow/DateDataRow';
import {Book} from '../types/types';

interface Props {
    book: Book;
    onChange: (book: Book) => void;
}

const MetaDataBlock = ({book, onChange}: Props): JSX.Element => {
    const handleAuthorChange = (newAuthor: string) => {
        book.author = newAuthor;
        onChange(book);
    };
    const handleReleaseDateChange = (newReleaseDate: Dayjs) => {
        book.releaseDate = newReleaseDate;
        onChange(book);
    };
    const handleIsbnChange = (newIsbn: string) => {
        book.isbn = newIsbn;
        onChange(book);
    };

    return (
        <div>
            <h3 className="title-small">Information</h3>
            <table style={{width: '100%'}}>
                <thead></thead>
                <tbody>
                    <DataRow title="Author" value={book.author} onChangeDone={handleAuthorChange} />
                    <DateDataRow title="Release date" value={book.releaseDate} onChangeDone={handleReleaseDateChange} />
                    <DataRow title="ISBN" value={book.isbn} onChangeDone={handleIsbnChange} />
                </tbody>
            </table>
        </div>
    );
};

export default MetaDataBlock;
