import React from 'react';
import NewBookModal from './NewBookModal';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('NewBookModal', () => {
    it('should submit the new book data when all fields are filled', () => {
        const onSubmitMock = jest.fn();
        render(<NewBookModal onClose={() => {}} onSubmit={onSubmitMock} bookAlreadyExists={false} />);

        userEvent.type(screen.getByLabelText('Book name'), 'Some Book Title');
        userEvent.type(screen.getByLabelText('ISBN'), 'Some ISBN');
        userEvent.type(screen.getByLabelText('Author'), 'Some Book Author');
        const releaseDateInput = screen.getByLabelText('Release Date');
        userEvent.type(releaseDateInput, '2021-03-12'); // input of type date need this format

        userEvent.click(screen.getByText('Create'));

        expect(onSubmitMock).toHaveBeenCalledWith({
            title: 'Some Book Title',
            isbn: 'Some ISBN',
            author: 'Some Book Author',
            releaseDate: '2021-03-12',
        });
    });

    it('should not try to add a book without sufficient data', () => {
        const onSubmitMock = jest.fn();
        render(<NewBookModal onClose={() => {}} onSubmit={onSubmitMock} bookAlreadyExists={false} />);

        userEvent.click(screen.getByText('Create'));

        expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it('should render book already exists error message', () => {
        const onSubmitMock = jest.fn();
        render(<NewBookModal onClose={() => {}} onSubmit={onSubmitMock} bookAlreadyExists={true} />);

        screen.getByText('This book is already in your library');
    });
});
