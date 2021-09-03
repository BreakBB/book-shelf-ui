import {waitFor} from '@testing-library/react';
import axios from 'axios';
import {renderWithRouterMatch, TEST_BOOKS} from '../testUtils';
import BookDetailView from './BookDetailView';
import {history} from '../history';
import userEvent from '@testing-library/user-event';
import {BASE_URL} from '../bookService';
import {Book} from '../types/types';

describe('BookCardView', () => {
    let axiosMockedGet;

    const mockAxios = (responseData?: Book | null): void => {
        axiosMockedGet = jest.fn().mockReturnValue({data: responseData});
        axios.get = axiosMockedGet;
    };

    afterEach(() => {
        history.push('/');
    });

    it('should render the book details', async () => {
        const book = TEST_BOOKS.harryPotter1;
        mockAxios(book);
        history.push(`/${book.isbn}`);

        const {getByText, getByAltText} = renderWithRouterMatch(BookDetailView, '/:isbn');

        // We need to use waitFor because we have an async call in our component which changes the state
        await waitFor(() => {
            expect(axiosMockedGet).toHaveBeenCalledWith(`${BASE_URL}/books/${book.isbn}`);
        });
        getByText(book.title);
        const coverImage = getByAltText(book.title) as HTMLImageElement;
        expect(coverImage.src).toBe(`${BASE_URL}/covers/${book.isbn}`);
    });

    it('should show "no details" placeholder without a isbn', async () => {
        mockAxios();

        const {getByText} = renderWithRouterMatch(BookDetailView, '/');

        expect(axiosMockedGet).not.toHaveBeenCalled();
        getByText('No Details');
    });

    it('should show "no details" placeholder for invalid ISBN', async () => {
        axiosMockedGet = jest.fn().mockImplementation(() => {
            throw new Error('Invalid ISBN');
        });
        axios.get = axiosMockedGet;
        history.push('/123invalid');

        const {getByText} = renderWithRouterMatch(BookDetailView, '/:isbn');

        await waitFor(() => {
            expect(axiosMockedGet).toHaveBeenCalledWith(`${BASE_URL}/books/123invalid`);
        });
        getByText('No Details');
    });

    it('should navigate to book overview on back button click', async () => {
        const book = TEST_BOOKS.harryPotter1;
        mockAxios(book);
        history.push(`/${book.isbn}`);

        const {getAllByRole} = renderWithRouterMatch(BookDetailView, '/:isbn');

        await waitFor(() => {
            expect(axiosMockedGet).toHaveBeenCalledWith(`${BASE_URL}/books/${book.isbn}`);
        });
        const allButtons = getAllByRole('button');

        userEvent.click(allButtons[0]);

        expect(history.location.pathname).toBe('/');
    });
});
