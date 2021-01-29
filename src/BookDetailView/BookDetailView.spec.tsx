import {waitFor} from '@testing-library/react';
import axios from "axios";
import {BookResponseData} from "../types/types";
import {renderWithRouterMatch, TEST_BOOKS} from "../testUtils";
import BookDetailView from "./BookDetailView";
import {history} from "../history";

describe('BookCardView', () => {
    let axiosMockedGet;

    const mockAxios = (responseData?: BookResponseData | null): void => {
        axiosMockedGet = jest.fn().mockReturnValue({data: responseData});
        axios.get = axiosMockedGet;
    }

    afterEach(() => {
        history.goBack();
    });

    it('should render the book details', async () => {
        const book = TEST_BOOKS.harryPotter1;
        mockAxios(book);
        history.push(`/${book.isbn}`)

        const {getByText, getByAltText} = renderWithRouterMatch(BookDetailView, '/:isbn');

        // We need to use waitFor because we have an async call in our component which changes the state
        await waitFor(() => {
            expect(axiosMockedGet).toHaveBeenCalledWith(`http://localhost:8080/books/${book.isbn}`)
        })
        const pageTitle: HTMLElement = getByText(book.title);
        expect(pageTitle.tagName).toBe("H3");
        const coverImage = getByAltText(book.title) as HTMLImageElement;
        expect(coverImage.src).toBe(`http://localhost:8080/covers/${book.isbn}`)
    });

    it('should show "no details" placeholder without a isbn', async () => {
        mockAxios();

        const {getByText} = renderWithRouterMatch(BookDetailView, '/');

        expect(axiosMockedGet).not.toHaveBeenCalled();
        getByText("No Details");
    });

    it('should show "no details" placeholder for empty response data', async () => {
        const book = TEST_BOOKS.harryPotter1;
        mockAxios(null);
        history.push(`/${book.isbn}`)

        const {getByText} = renderWithRouterMatch(BookDetailView, '/:isbn');

        await waitFor(() => {
            expect(axiosMockedGet).toHaveBeenCalledWith(`http://localhost:8080/books/${book.isbn}`)
        })
        getByText("No Details");
    });
});