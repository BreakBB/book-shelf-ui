import React from 'react';
import placeholderCover from './placeholder-cover.jpg';

interface Props {
    title: string;
    onEnter?: () => void;
    onLeave?: () => void;
}

export const PlaceholderImage = ({title, onEnter, onLeave}: Props): JSX.Element => (
    <div className="placeholder-image-container">
        <img onMouseEnter={onEnter} onMouseLeave={onLeave} className="image" src={placeholderCover} alt="placeholder" />
        <div className="placeholder-image-text">{title}</div>
    </div>
);
