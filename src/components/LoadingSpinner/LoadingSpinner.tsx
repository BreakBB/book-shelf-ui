import React from 'react';
import {ReactComponent as BookShelfIcon} from './book-shelf.svg';
import './LoadingSpinner.css';

const LoadingSpinner = (): JSX.Element => (
    <div className="loading-spinner-container">
        <div className="loading-spinner">
            <BookShelfIcon />
            <p>Loading Books...</p>
        </div>
    </div>
);

export default LoadingSpinner;
