import React from "react";
import {GridListTile} from "@material-ui/core";
import "./BookCardView.css";
import {PlaceholderImage} from "./PlaceholderImage";

interface Props {
    title: string;
    isbn: string;
    coverId: string;
}

export default function BookCard(props: Props) {

    const localCoverUrl = `http://localhost:8080/covers/${props.isbn}`

    const onClick = (title: string) => {
        console.log('title', title);
    }

    return (
        <GridListTile onClick={() => onClick(props.title)} key={props.isbn} style={{height: 250, width: 180, margin: 5}}>
            {props.coverId
                ? <img className="image" src={localCoverUrl} alt={props.title}/>
                : <PlaceholderImage title={props.title}/>
            }
        </GridListTile>
    )
}