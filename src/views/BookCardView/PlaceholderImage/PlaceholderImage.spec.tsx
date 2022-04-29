import React from 'react';
import {render, screen} from '@testing-library/react';
import {PlaceholderImage} from './PlaceholderImage';
import {TEST_BOOKS} from '../../../testUtils';

describe('BookCardView', () => {
    it('should render the placeholder image', () => {
        const {title} = TEST_BOOKS.harryPotter1;

        render(<PlaceholderImage title={title} />);

        const image = screen.getByAltText('placeholder') as HTMLImageElement;
        expect(image.src).toBe('http://localhost/placeholder-cover.jpg');
        const imageText = screen.getByText(title);
        expect(imageText.className).toBe('placeholder-image-text');
    });
});
