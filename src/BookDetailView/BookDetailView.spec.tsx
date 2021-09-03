import {screen, waitFor} from '@testing-library/react';
import axios from 'axios';
import {renderWithRouterMatch, TEST_BOOKS} from '../testUtils';
import BookDetailView from './BookDetailView';
import {history} from '../history';
import userEvent from '@testing-library/user-event';
import {BASE_URL} from '../bookService';
import {Book} from '../types/types';

jest.mock('axios');

describe('BookCardView', () => {
    const axiosMock = axios as jest.Mocked<typeof axios>;

    const mockAxios = (responseData?: Book | null): void => {
        axiosMock.get.mockResolvedValue({data: responseData});
    };

    afterEach(() => {
        history.push('/books');
        jest.resetAllMocks();
    });

    it('should render the book details', async () => {
        const book = TEST_BOOKS.harryPotter1;
        mockAxios(book);
        history.push(`/books/${book.isbn}`);

        renderWithRouterMatch(BookDetailView, '/books/:isbn');

        // We need to use waitFor because we have an async call in our component which changes the state
        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(`${BASE_URL}/books/${book.isbn}`);
        });
        screen.getByText(book.title);
        const coverImage = screen.getByAltText(book.title) as HTMLImageElement;
        expect(coverImage.src).toBe(`${BASE_URL}/covers/${book.isbn}`);
    });

    it('should show "no details" placeholder without a isbn', async () => {
        mockAxios();

        renderWithRouterMatch(BookDetailView, '/');

        expect(axiosMock.get).not.toHaveBeenCalled();
        screen.getByText('No Details');
    });

    it('should show "no details" placeholder for invalid ISBN', async () => {
        axiosMock.get = jest.fn().mockImplementation(() => {
            throw new Error('Invalid ISBN');
        });
        history.push('/books/123invalid');

        renderWithRouterMatch(BookDetailView, '/books/:isbn');

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(`${BASE_URL}/books/123invalid`);
        });
        screen.getByText('No Details');
    });

    it('should navigate to book overview on back button click', async () => {
        const book = TEST_BOOKS.harryPotter1;
        mockAxios(book);
        history.push(`/books/${book.isbn}`);

        renderWithRouterMatch(BookDetailView, '/books/:isbn');

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(`${BASE_URL}/books/${book.isbn}`);
        });
        const allButtons = screen.getAllByRole('button');

        userEvent.click(allButtons[0]);

        expect(history.location.pathname).toBe('/books');
    });

    it('should navigate to book overview on book deletion', async () => {
        const book = TEST_BOOKS.harryPotter1;
        mockAxios(book);
        history.push(`/books/${book.isbn}`);

        renderWithRouterMatch(BookDetailView, '/books/:isbn');

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenCalledWith(`${BASE_URL}/books/${book.isbn}`);
        });

        const deleteButton = screen.getByRole('button', {name: /Delete Book/i});
        userEvent.click(deleteButton);
        await waitFor(() => {
            expect(axiosMock.delete).toHaveBeenCalled();
        });

        expect(history.location.pathname).toBe('/books');
    });
});
