import {
    reducer,
    menuInitialState,
    fileMenuOpen,
    toggleFileMenu,
    openSettingsMenu,
    closeSettingsMenu,
    settingsMenuOpen
} from '../../../src/reducers/menus';
import {
    openExtManagerModal,
    openScreenshotModal
} from '../../../src/reducers/modals';

describe('menus reducer', () => {
    test('toggleFileMenu closes a menu that is already open', () => {
        const initialState = {
            ...menuInitialState,
            fileMenu: true
        };

        const nextState = reducer(initialState, toggleFileMenu());

        expect(fileMenuOpen({scratchGui: {menus: nextState}})).toBe(false);
    });

    test('settings menu actions work as expected', () => {
        let nextState = reducer(menuInitialState, openSettingsMenu());
        expect(settingsMenuOpen({scratchGui: {menus: nextState}})).toBe(true);

        nextState = reducer(nextState, closeSettingsMenu());
        expect(settingsMenuOpen({scratchGui: {menus: nextState}})).toBe(false);
    });

    test('modal actions expected by the menu bar are exported', () => {
        expect(typeof openExtManagerModal).toBe('function');
        expect(typeof openScreenshotModal).toBe('function');
    });
});
