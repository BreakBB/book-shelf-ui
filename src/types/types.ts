export interface Book {
    isbn: string;
    title: string;
    author: string;
    releaseDate: string;
    hasCover: boolean;
}

export interface NewBookRequest {
    isbn: string;
    title: string;
    author: string;
    releaseDate: string;
}
