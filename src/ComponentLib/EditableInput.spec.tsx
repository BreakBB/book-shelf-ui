import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableInput } from './EditableInput';

describe('EditableInput', () => {
    const value = 'This is a value';
    const onChangeDoneMock = jest.fn();

    const initTest = (isHeader?: boolean) => {
        render(<EditableInput text={value} header={isHeader} onChangeDone={onChangeDoneMock} />);
    };

    it('should switch to editMode if edit button is clicked', async () => {
        initTest();
        screen.getByText(value);
        const editButton = screen.getByRole('button');
        userEvent.click(editButton);

        const textInput = screen.getByRole('textbox') as HTMLInputElement;
        expect(textInput.value).toBe(value);
        expect(screen.queryByText(value)).toBe(null);
    });

    it('should switch back to view mode if edit button is pressed twice', () => {
        initTest();
        const editButton = screen.getByRole('button');
        userEvent.click(editButton);

        screen.getByRole('textbox');

        const doneButton = screen.getByRole('button');
        userEvent.click(doneButton);
        screen.getByText(value);
    });

    it('should call onChangeDone callback if the value changed', () => {
        initTest();
        const newValue = 'Some other value';
        const editButton = screen.getByRole('button');
        userEvent.click(editButton);

        const textInput = screen.getByRole('textbox') as HTMLInputElement;
        userEvent.clear(textInput);
        userEvent.type(textInput, newValue);
        const doneButton = screen.getByRole('button');
        userEvent.click(doneButton);

        screen.getByText(newValue);
        expect(onChangeDoneMock).toHaveBeenCalledWith(newValue);
    });

    it('should not call onChangeDone callback if value did not change', () => {
        initTest();
        const editButton = screen.getByRole('button');
        userEvent.click(editButton);

        const doneButton = screen.getByRole('button');
        userEvent.click(doneButton);

        screen.getByText(value);
        expect(onChangeDoneMock).not.toHaveBeenCalled();
    });

    it('should render as header if header prop is given', () => {
        initTest(true);

        const textSpan = screen.getByText(value) as HTMLSpanElement;

        const parentDiv = textSpan.parentElement;
        expect(parentDiv).not.toBeNull();
        expect(parentDiv?.parentElement).not.toBeNull();
        expect(parentDiv?.parentElement?.className).toBe('header');
    });
});
