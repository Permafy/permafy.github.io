import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {FormattedMessage} from 'react-intl';

import {MenuItem} from '../menu/menu.jsx';
import lightModeIcon from './tw-sun.svg';
import darkModeIcon from './tw-moon.svg';
import styles from './settings-menu.css';

const GuiThemeMenu = ({
    onChangeTheme,
    onRequestCloseSettings
}) => {
    const [theme, setTheme] = useState(localStorage.getItem('tw:theme') || 'light');

    useEffect(() => {
        const handleStorageChange = e => {
            if (e.key === 'tw:theme') {
                setTheme(e.newValue);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    return (
        <MenuItem>
            <div
                className={styles.option}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => {
                    onChangeTheme();
                    toggleTheme();
                    onRequestCloseSettings();
                }}
            >
                <img
                    src={theme === 'dark' ? lightModeIcon : darkModeIcon}
                    draggable={false}
                    width={24}
                    height={24}
                />
                <span className={styles.submenuLabel}>
                    {theme === 'dark' ? (
                        <FormattedMessage
                            defaultMessage="Switch To Light Mode"
                            description="Menu item to change color scheme to light (it is currently dark)"
                            id="tw.darkMode"
                        />
                    ) : (
                        <FormattedMessage
                            defaultMessage="Switch To Dark Mode"
                            description="Menu item to change color scheme to dark (it is currently light)"
                            id="tw.lightMode"
                        />
                    )}
                </span>
            </div>
        </MenuItem>
    );
};

GuiThemeMenu.propTypes = {
    onChangeTheme: PropTypes.func,
    onRequestCloseSettings: PropTypes.func
};

export default GuiThemeMenu;
