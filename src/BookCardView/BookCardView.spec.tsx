import React from 'react';
import {render, waitFor} from '@testing-library/react';
import BookCardView from "./BookCardView";
import axios from "axios";
import {BookResponseData} from "../types/types";
import {TEST_BOOKS} from "../testUtils";

describe('BookCardView', () => {
    let axiosMockedGet;

    const initTest = (responseData: BookResponseData[] = []): void => {
        axiosMockedGet = jest.fn().mockReturnValue({data: responseData});
        axios.get = axiosMockedGet;
    }

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the header', async () => {
        initTest();

        const {getByText} = render(<BookCardView/>);

        // We need to use waitFor because we have an async call in our component which changes the state
        await waitFor(() => {
            expect(axiosMockedGet).toHaveBeenCalledWith("http://localhost:8080/books")
        })
        const header: HTMLElement = getByText("Your Collection");
        expect(header).not.toBeUndefined();
        expect(header.tagName).toBe("H3");
        expect(header.classList).toContain("title");
        expect(header.classList).toContain("text-underline");
    });

    it('should render multiple book cards', async () => {
        initTest([
            TEST_BOOKS.harryPotter1,
            TEST_BOOKS.harryPotter2
        ]);

        const {getByText, queryByText} = render(<BookCardView/>);

        await waitFor(() => {
            expect(axiosMockedGet).toHaveBeenCalledWith("http://localhost:8080/books")
        });
        expect(queryByText("No Books")).toBeNull();
        const header: HTMLElement = getByText("Your Collection");
        const list = header.parentElement?.lastChild as HTMLElement;
        expect(list).not.toBeUndefined();
        expect(list.childNodes.length).toBe(2);
    });

    it('should render the placeholder text without books', async () => {
        initTest();

        const {getByText} = render(<BookCardView/>);

        await waitFor(() => {
            expect(axiosMockedGet).toHaveBeenCalledWith("http://localhost:8080/books")
        });
        getByText("No Books");
    });

    it('should handle network errors', async () => {
        axiosMockedGet = jest.fn(() => {
            throw new Error("Some network error")
        });
        axios.get = axiosMockedGet;

        const {getByText} = render(<BookCardView/>);

        await waitFor(() => {
            expect(axiosMockedGet).toHaveBeenCalledWith("http://localhost:8080/books")
        });
        getByText("No Books");
    });
});