import { Dayjs } from 'dayjs';

export interface Book {
    isbn: string;
    title: string;
    author: string;
    releaseDate: Dayjs;
    coverId?: string;
}

export interface NewBookRequest {
    isbn: string;
    title: string;
    author: string;
    releaseDate: string;
}

// The backend sends the releaseDate as string
export interface BookResponseData {
    isbn: string;
    title: string;
    author: string;
    releaseDate: string;
    coverId: string;
}
