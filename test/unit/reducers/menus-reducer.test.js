import {reducer, menuInitialState, fileMenuOpen, toggleFileMenu} from '../../../src/reducers/menus';

describe('menus reducer', () => {
    test('toggleFileMenu closes a menu that is already open', () => {
        const initialState = {
            ...menuInitialState,
            fileMenu: true
        };

        const nextState = reducer(initialState, toggleFileMenu());

        expect(fileMenuOpen({scratchGui: {menus: nextState}})).toBe(false);
    });
});
