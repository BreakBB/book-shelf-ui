import React from "react";
import placeholderCover from "./placeholder-cover.jpg";

interface Props {
    title: string;
}

export const PlaceholderImage = (props: Props) => (
    <div className="placeholder-image-container">
        <img className="image" src={placeholderCover} alt="placeholder"/>
        <div className="placeholder-image-text">
            {props.title}
        </div>
    </div>
)