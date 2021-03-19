import React from 'react';
import DataRow from "./DataRow";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe('DataRow', () => {
    const title = "This is a title";
    const value = "This is a value";
    const onChangeDoneMock = jest.fn();

    beforeEach(() => {

        render(
            <table>
                <tbody>
                    <DataRow title={title} value={value} onChangeDone={onChangeDoneMock}/>
                </tbody>
            </table>
        );
    });

    it('should render title and value', () => {
        screen.getByText(title);
        screen.getByText(value);
    });

    it('should switch to editMode if edit button is clicked', async () => {
        screen.getByText(value);
        const editButton = screen.getByRole("button");
        userEvent.click(editButton);

        const textInput = screen.getByRole("textbox") as HTMLInputElement;
        expect(textInput.value).toBe(value);
        expect(screen.queryByText(value)).toBe(null);
    });

    it('should switch back to view mode if edit button is pressed twice', () => {
        const editButton = screen.getByRole("button");
        userEvent.click(editButton);

        screen.getByRole("textbox");

        const doneButton = screen.getByRole("button");
        userEvent.click(doneButton);
        screen.getByText(value);
    });

    it('should call onChangeDone callback if the value changed', () => {
        const newValue = "Some other value";
        const editButton = screen.getByRole("button");
        userEvent.click(editButton);

        const textInput = screen.getByRole("textbox") as HTMLInputElement;
        userEvent.clear(textInput);
        userEvent.type(textInput, newValue);
        const doneButton = screen.getByRole("button");
        userEvent.click(doneButton);

        screen.getByText(newValue);
        expect(onChangeDoneMock).toHaveBeenCalledWith(newValue);
    });

    it('should not call onChangeDone callback if value did not change', () => {
        const editButton = screen.getByRole("button");
        userEvent.click(editButton);

        const doneButton = screen.getByRole("button");
        userEvent.click(doneButton);

        screen.getByText(value);
        expect(onChangeDoneMock).not.toHaveBeenCalled();
    });
});