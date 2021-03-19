import React from 'react'
import {Book, BookResponseData} from "../../types/types";
import DataRow from "./DataRow";
import axios from "axios";
import DateDataRow from "./DateDataRow";
import {toBookRequest} from "../../utils";
import {Dayjs} from "dayjs";

interface Props {
    book: Book,
    handleBookUpdate: (updatedBook: BookResponseData) => void
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

const updateBook = async (isbn: string, book: Book, handleBookUpdate: (BookResponseData) => void): Promise<void> => {
    const bookResponse = await axios.put(`http://localhost:8080/books/${isbn}`, {
        ...toBookRequest(book)
    });
    handleBookUpdate(bookResponse.data);
}

export default MetaDataBlock;