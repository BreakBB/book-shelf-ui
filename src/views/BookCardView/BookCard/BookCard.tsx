import React from 'react';
import '../BookCardView.css';
import {useHistory} from 'react-router-dom';
import {PlaceholderImage} from '../PlaceholderImage/PlaceholderImage';

interface Props {
    title: string;
    isbn: string;
    hasCover: boolean;
}

const BookCard = (props: Props): JSX.Element => {
    const history = useHistory();

    const localCoverUrl = `/covers/${props.isbn}`;

    return (
        <li onClick={() => history.push(`/books/${props.isbn}`)} key={props.isbn} className="book-card hover-grow">
            {props.hasCover ? (
                <img className="image" src={localCoverUrl} alt={props.title} />
            ) : (
                <PlaceholderImage title={props.title} />
            )}
        </li>
    );
};

export default BookCard;
