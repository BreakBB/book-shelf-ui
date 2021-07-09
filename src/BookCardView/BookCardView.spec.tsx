import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import BookCardView, {NO_BOOKS_YET, YOUR_COLLECTION} from "./BookCardView";
import axios from "axios";
import {TEST_BOOKS} from "../testUtils";
import {BASE_URL} from "../bookService";
import userEvent from "@testing-library/user-event";
import {NewBookRequest} from "../types/types";

jest.mock('axios');

const bookUrl = `${BASE_URL}/books`;

describe('BookCardView', () => {
    const axiosMock = axios as jest.Mocked<typeof axios>;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the header', async () => {
        axiosMock.get.mockResolvedValueOnce({data: []});

        const {getByText} = render(<BookCardView/>);

        // We need to use waitFor because we have an async call in our component which changes the state
        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(bookUrl);
        })
        const header: HTMLElement = getByText(YOUR_COLLECTION);
        expect(header).not.toBeUndefined();
        expect(header.tagName).toBe("H1");
        expect(header.classList).toContain("title");
    });

    it('should render multiple book cards', async () => {
        axiosMock.get.mockResolvedValueOnce({
            data: [
                TEST_BOOKS.harryPotter1,
                TEST_BOOKS.harryPotter2
            ]
        });

        const {getByText, queryByText} = render(<BookCardView/>);

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(bookUrl);
        });
        expect(queryByText(NO_BOOKS_YET)).toBeNull();
        const header: HTMLElement = getByText(YOUR_COLLECTION);
        const list = header.parentElement?.lastChild as HTMLElement;
        expect(list).not.toBeUndefined();
        expect(list.childNodes.length).toBe(3);
    });

    it('should render the placeholder text without books', async () => {
        axiosMock.get.mockResolvedValueOnce({data: []});

        const {getByText} = render(<BookCardView/>);

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(bookUrl);
        });
        getByText(NO_BOOKS_YET);
        const header: HTMLElement = getByText(YOUR_COLLECTION);
        const list = header.parentElement?.lastChild as HTMLElement;
        expect(list).not.toBeUndefined();
        expect(list.childNodes.length).toBe(1);
    });

    it('should handle network errors', async () => {
        axiosMock.get.mockRejectedValueOnce("Some network error");

        const {getByText} = render(<BookCardView/>);

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(bookUrl);
        });
        getByText(NO_BOOKS_YET);
    });

    it('should add a new book', async () => {
        axiosMock.get.mockResolvedValueOnce({data: []});

        render(<BookCardView/>);

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(bookUrl);
        });

        insertBook(TEST_BOOKS.harryPotter1);

        expect(axiosMock.post).toHaveBeenCalled();

        expect(screen.queryByText("This book is already in your library")).toBe(null);
    });

    it('should not add a book that already exists', async () => {
        axiosMock.get.mockResolvedValueOnce({data: []});
        axiosMock.post.mockRejectedValueOnce({
            response: {
                status: 409
            }
        });

        render(<BookCardView/>);

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(bookUrl);
        });

        insertBook(TEST_BOOKS.harryPotter1);

        await waitFor(() => {
            expect(axiosMock.post).toHaveBeenCalled();
        });

        expect(screen.getByText("This book is already in your library"));
    });

    const insertBook = (book: NewBookRequest) => {
        const addButton = document.getElementsByClassName("add-book-card")[0];
        userEvent.click(addButton);

        userEvent.type(screen.getByLabelText("Book name"), book.title);
        userEvent.type(screen.getByLabelText("ISBN"), book.isbn);
        userEvent.type(screen.getByLabelText("Author"), book.author);
        const releaseDateInput = screen.getByLabelText("Release Date");
        userEvent.clear(releaseDateInput); // today's date is the initial value which we need to clear
        userEvent.type(releaseDateInput, book.releaseDate.toString());

        userEvent.click(screen.getByText("Create"));
    }
});