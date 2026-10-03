import {
    reducer,
    menuInitialState,
    fileMenuOpen,
    toggleFileMenu,
    openSettingsMenu,
    closeSettingsMenu,
    settingsMenuOpen,
    toggleSettingsMenu,
    openLanguageMenu,
    toggleLanguageMenu,
    languageMenuOpen
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

        nextState = reducer(nextState, openLanguageMenu());
        expect(languageMenuOpen({scratchGui: {menus: nextState}})).toBe(true);

        nextState = reducer(nextState, closeSettingsMenu());
        expect(settingsMenuOpen({scratchGui: {menus: nextState}})).toBe(false);
        expect(languageMenuOpen({scratchGui: {menus: nextState}})).toBe(false);

        nextState = reducer(nextState, toggleSettingsMenu());
        nextState = reducer(nextState, toggleLanguageMenu());
        expect(languageMenuOpen({scratchGui: {menus: nextState}})).toBe(true);
        nextState = reducer(nextState, toggleSettingsMenu());
        expect(settingsMenuOpen({scratchGui: {menus: nextState}})).toBe(false);
        expect(languageMenuOpen({scratchGui: {menus: nextState}})).toBe(false);

        nextState = reducer(nextState, toggleSettingsMenu());
        nextState = reducer(nextState, toggleLanguageMenu());
        expect(settingsMenuOpen({scratchGui: {menus: nextState}})).toBe(true);
        expect(languageMenuOpen({scratchGui: {menus: nextState}})).toBe(true);
    });

    test('toggleLanguageMenu opens and closes the language menu', () => {
        let nextState = reducer(menuInitialState, toggleLanguageMenu());
        expect(languageMenuOpen({scratchGui: {menus: nextState}})).toBe(true);

        nextState = reducer(nextState, toggleLanguageMenu());
        expect(languageMenuOpen({scratchGui: {menus: nextState}})).toBe(false);
    });

    test('modal actions expected by the menu bar are exported', () => {
        expect(typeof openExtManagerModal).toBe('function');
        expect(typeof openScreenshotModal).toBe('function');
    });
});
