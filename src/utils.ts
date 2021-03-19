import {Book, BookResponseData, NewBookRequest} from "./types/types";
import dayjs from "dayjs";
import axios from "axios";

export const toBook = (book: BookResponseData): Book => {
    return {
        ...book,
        releaseDate: dayjs(book.releaseDate)
    }
}

export const toBookRequest = (book: Book): NewBookRequest => {
    return {
        ...book,
        releaseDate: book.releaseDate.format("YYYY-MM-DD")
    }
}

export const updateBook = async (isbn: string, book: Book, handleBookUpdate: (Book) => void): Promise<void> => {
    const bookResponse = await axios.put(`http://localhost:8080/books/${isbn}`, {
        ...toBookRequest(book)
    });
    handleBookUpdate(toBook(bookResponse.data));
}