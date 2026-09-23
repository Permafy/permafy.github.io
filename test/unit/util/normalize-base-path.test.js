import {normalizeBasePath} from '../../../src/lib/normalize-base-path';

describe('normalizeBasePath', () => {
    test('uses a root-relative path when ROOT is empty', () => {
        expect(normalizeBasePath('')).toBe('/');
    });

    test('preserves an existing root with a trailing slash', () => {
        expect(normalizeBasePath('/permafy.github.io/')).toBe('/permafy.github.io/');
    });

    test('adds a trailing slash to a root without one', () => {
        expect(normalizeBasePath('/permafy.github.io')).toBe('/permafy.github.io/');
    });
});
