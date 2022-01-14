import {clearTokens} from './storageUtils';

describe('storageUtils', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should clear access and refresh token', () => {
        localStorage.setItem('access_token', 'test');
        localStorage.setItem('refresh_token', 'test');

        clearTokens();

        expect(localStorage.getItem('access_token')).toBe(null);
        expect(localStorage.getItem('refresh_token')).toBe(null);
    });
});
