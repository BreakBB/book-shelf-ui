import React from 'react'
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import {Book} from "../../types/types";
import DataRow from "./DataRow";

interface Props {
    book: Book
}

function MetaDataBlock(props: Props): JSX.Element {
    const {book} = props;

    const releaseDate = moment(book.releaseDate).format("DD.MM.yyyy").toString();
    return (
        <div>
            <table style={{width: "100%"}}>
                <thead>
                    <tr style={{textAlign: "center"}}>
                        <td colSpan={2}>
                            <Typography variant="h5">
                                Information
                            </Typography>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <DataRow title="Author" value={book.author}/>
                    <DataRow title="Release date" value={releaseDate}/>
                    <DataRow title="ISBN" value={book.isbn}/>
                </tbody>
            </table>
        </div>
    );
}

export default MetaDataBlock;