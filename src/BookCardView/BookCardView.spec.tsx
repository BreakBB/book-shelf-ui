import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import BookCardView, {NO_BOOKS_YET, YOUR_COLLECTION} from './BookCardView';
import axios from 'axios';
import {TEST_BOOKS} from '../testUtils';
import {BASE_URL} from '../bookService';
import userEvent from '@testing-library/user-event';
import {Book, NewBookRequest} from '../types/types';
import dayjs from 'dayjs';

jest.mock('axios');

const bookUrl = `${BASE_URL}/books`;

describe('BookCardView', () => {
    const axiosMock = axios as jest.Mocked<typeof axios>;

    const initTest = (initialBooks: Book[]) => {
        axiosMock.get.mockResolvedValueOnce({data: initialBooks});
        render(<BookCardView />);
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the header', async () => {
        initTest([]);

        // We need to use waitFor because we have an async call in our component which changes the state
        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(bookUrl);
        });
        const header: HTMLElement = screen.getByText(YOUR_COLLECTION);
        expect(header).not.toBeUndefined();
        expect(header.tagName).toBe('H1');
        expect(header.classList).toContain('title');
    });

    it('should render multiple book cards', async () => {
        initTest([TEST_BOOKS.harryPotter1, TEST_BOOKS.harryPotter2]);

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(bookUrl);
        });
        expect(screen.queryByText(NO_BOOKS_YET)).toBeNull();
        const header: HTMLElement = screen.getByText(YOUR_COLLECTION);
        const list = header.parentElement?.lastChild as HTMLElement;
        expect(list).not.toBeUndefined();
        expect(list.childNodes.length).toBe(3);
    });

    it('should render the placeholder text without books', async () => {
        initTest([]);

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(bookUrl);
        });
        screen.getByText(NO_BOOKS_YET);
        const header: HTMLElement = screen.getByText(YOUR_COLLECTION);
        const list = header.parentElement?.lastChild as HTMLElement;
        expect(list).not.toBeUndefined();
        expect(list.childNodes.length).toBe(1);
    });

    it('should handle network errors', async () => {
        axiosMock.get.mockRejectedValueOnce('Some network error');

        render(<BookCardView />);

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(bookUrl);
        });
        screen.getByText(NO_BOOKS_YET);
    });

    it('should add a new book', async () => {
        initTest([]);
        axiosMock.post.mockResolvedValueOnce({data: TEST_BOOKS.harryPotter1});

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(bookUrl);
        });

        insertBook(TEST_BOOKS.harryPotter1);

        expect(screen.queryByText('This book is already in your library')).toBeNull();

        expect(axiosMock.post).toHaveBeenCalled();
        expect(await screen.findByAltText('Harry Potter und der Stein der Weisen'));

        expect(screen.queryByText(NO_BOOKS_YET)).toBeNull();
        screen.getByText(YOUR_COLLECTION);
    });

    it('should not add a book that already exists', async () => {
        initTest([]);
        axiosMock.post.mockRejectedValueOnce({
            response: {
                status: 409,
            },
        });

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(bookUrl);
        });

        insertBook(TEST_BOOKS.harryPotter1);

        await waitFor(() => {
            expect(axiosMock.post).toHaveBeenCalled();
        });

        expect(screen.getByText('This book is already in your library'));
    });

    const insertBook = (book: NewBookRequest) => {
        const addButton = document.getElementsByClassName('add-book-card')[0];
        userEvent.click(addButton);

        userEvent.type(screen.getByLabelText('Book name'), book.title);
        userEvent.type(screen.getByLabelText('ISBN'), book.isbn);
        userEvent.type(screen.getByLabelText('Author'), book.author);
        const releaseDateInput = screen.getByLabelText('Release Date');
        userEvent.type(releaseDateInput, dayjs(book.releaseDate).format('YYYY-MM-DD'));

        userEvent.click(screen.getByText('Create'));
    };
});
