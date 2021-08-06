import React from 'react';
import DataRow from './DataRow';
import { render, screen } from '@testing-library/react';

describe('DataRow', () => {
    const title = 'This is a title';
    const value = 'This is a value';
    const onChangeDoneMock = jest.fn();

    beforeEach(() => {
        render(<DataRow title={title} value={value} onChangeDone={onChangeDoneMock} />);
    });

    it('should render title and value', () => {
        screen.getByText(title);
        screen.getByText(value);
    });
});
