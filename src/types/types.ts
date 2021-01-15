import {Moment} from "moment";

export interface Book {
    isbn: string;
    title: string;
    author: string;
    releaseDate: Moment;
    coverId: string;
}

// The backend sends the releaseDate as string
export interface BookResponseData {
    isbn: string;
    title: string;
    author: string;
    releaseDate: string;
    coverId: string;
}
