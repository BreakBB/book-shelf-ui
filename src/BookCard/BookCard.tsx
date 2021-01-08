import React from "react";
import {GridListTile, GridListTileBar} from "@material-ui/core";

interface Props {
    title: string;
    author: string;
    isbn: string;
}

export default function BookCard(props: Props) {

    const coverUrl = `http://covers.openlibrary.org/b/isbn/${props.isbn}-M.jpg`

    return (
        <GridListTile key={props.isbn} style={{margin: "10px"}}>
            <img src={coverUrl} alt={props.title}/>
            <GridListTileBar style={{wordWrap: "inherit"}} title={props.title} subtitle={props.author} />
        </GridListTile>
    )
}