import React from 'react';
import placeholderCover from './placeholder-cover.jpg';
import './PlaceholderImage.css';

interface Props {
    title: string;
}

export const PlaceholderImage = ({title}: Props): JSX.Element => (
    <>
        <img src={placeholderCover} alt="placeholder" />
        <div className="placeholder-image-text">{title}</div>
    </>
);
