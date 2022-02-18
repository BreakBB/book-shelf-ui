import React from 'react';
import placeholderCover from './placeholder-cover.jpg';
import './PlaceholderImage.css';

interface Props {
    title: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const PlaceholderImage = ({title, onMouseEnter, onMouseLeave}: Props): JSX.Element => (
    <>
        <img onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} src={placeholderCover} alt="placeholder" />
        <div className="placeholder-image-text">{title}</div>
    </>
);
