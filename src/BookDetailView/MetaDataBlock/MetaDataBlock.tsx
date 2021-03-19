import React from 'react'
import {Book} from "../../types/types";
import DataRow from "./DataRow";
import DateDataRow from "./DateDataRow";
import {Dayjs} from "dayjs";
import { updateBook } from '../../utils';

interface Props {
    book: Book,
    handleBookUpdate: (updatedBook: Book) => void
}

function MetaDataBlock(props: Props): JSX.Element {
    const {book} = props;

    const handleAuthorChange = async (newAuthor: string) => {
        book.author = newAuthor;
        void await updateBook(book.isbn, book, props.handleBookUpdate);
    }
    const handleReleaseDateChange = async (newReleaseDate: Dayjs) => {
        book.releaseDate = newReleaseDate;
        void await updateBook(book.isbn, book, props.handleBookUpdate);
    }
    const handleIsbnChange = async (newIsbn: string) => {
        const oldIsbn = book.isbn;
        book.isbn = newIsbn;
        void await updateBook(oldIsbn, book, props.handleBookUpdate);
    }

    return (
        <div>
            <h3 className="title-small">
                Information
            </h3>
            <table style={{width: "100%"}}>
                <thead>
                    {/*<tr style={{textAlign: "center"}}>*/}
                    {/*    <td colSpan={4}>*/}
                    {/*    </td>*/}
                    {/*</tr>*/}
                </thead>
                <tbody>
                    <DataRow title="Author" value={book.author} onChangeDone={handleAuthorChange}/>
                    <DateDataRow title="Release date" value={book.releaseDate} onChangeDone={handleReleaseDateChange}/>
                    <DataRow title="ISBN" value={book.isbn} onChangeDone={handleIsbnChange}/>
                </tbody>
            </table>
        </div>
    );
}

export default MetaDataBlock;