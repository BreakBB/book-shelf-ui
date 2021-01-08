import React from "react";
import {GridListTile} from "@material-ui/core";
import "./BookCardView.css";
import {PlaceholderImage} from "./PlaceholderImage";
import {useHistory } from "react-router-dom";

interface Props {
    title: string;
    isbn: string;
    coverId: string;
}

function BookCard(props: Props) {
    const history = useHistory();

    const localCoverUrl = `http://localhost:8080/covers/${props.isbn}`

    return (
        <GridListTile onClick={() => history.push(props.isbn)} key={props.isbn} className="book-card">
            {props.coverId
                ? <img className="image" src={localCoverUrl} alt={props.title}/>
                : <PlaceholderImage title={props.title}/>
            }
        </GridListTile>
    )
}

export default BookCard;
