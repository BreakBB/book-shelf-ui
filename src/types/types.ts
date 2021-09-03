export interface Book {
    isbn: string;
    title: string;
    author: string;
    releaseDate: string;
    coverId?: string;
}

export interface NewBookRequest {
    isbn: string;
    title: string;
    author: string;
    releaseDate: string;
}
