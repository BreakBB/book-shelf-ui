import React from "react";
import "../BookCardView.css";
import {useHistory } from "react-router-dom";
import {PlaceholderImage} from "../PlaceholderImage/PlaceholderImage";

interface Props {
    title: string;
    isbn: string;
    coverId: string;
}

function BookCard(props: Props): JSX.Element {
    const history = useHistory();

    const localCoverUrl = `http://localhost:8080/covers/${props.isbn}`

    return (
        <li onClick={() => history.push(props.isbn)} key={props.isbn} className="book-card hover-grow">
            {props.coverId
                ? <img className="image" src={localCoverUrl} alt={props.title}/>
                : <PlaceholderImage title={props.title}/>
            }
        </li>
    )
}

export default BookCard;
