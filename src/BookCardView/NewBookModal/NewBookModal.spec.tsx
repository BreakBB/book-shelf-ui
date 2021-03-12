import React from 'react';
import NewBookModal from "./NewBookModal";
import {render} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";

describe('NewBookModal', () => {
    it('should submit the new book data when all fields are filled', () => {
        const onSubmitMock = jest.fn();
        const {getByLabelText, getByText} = render(<NewBookModal show={true} onClose={jest.fn()} onSubmit={onSubmitMock}/>);

        userEvent.type(getByLabelText("Book name"), "Some Book Title");
        userEvent.type(getByLabelText("ISBN"), "Some ISBN");
        userEvent.type(getByLabelText("Author"), "Some Book Author");
        const releaseDateInput = getByLabelText("Release Date");
        userEvent.clear(releaseDateInput); // today's date is the initial value which we need to clear
        userEvent.type(releaseDateInput, "03/12/2021");

        userEvent.click(getByText("Create"));

        expect(onSubmitMock).toHaveBeenCalledWith({
            title: "Some Book Title",
            isbn: "Some ISBN",
            author: "Some Book Author",
            releaseDate: dayjs("03/12/2021").toISOString()
        });
    });
});