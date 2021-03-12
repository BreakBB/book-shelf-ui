import React from 'react'
import {Book} from "../../types/types";
import DataRow from "./DataRow";

interface Props {
    book: Book
}

function MetaDataBlock(props: Props): JSX.Element {
    const {book} = props;

    return (
        <div>
            <table style={{width: "100%"}}>
                <thead>
                    <tr style={{textAlign: "center"}}>
                        <td colSpan={2}>
                            <h3 className="title-small">
                                Information
                            </h3>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <DataRow title="Author" value={book.author}/>
                    <DataRow title="Release date" value={book.releaseDate.format("DD.MM.YYYY")}/>
                    <DataRow title="ISBN" value={book.isbn}/>
                </tbody>
            </table>
        </div>
    );
}

export default MetaDataBlock;