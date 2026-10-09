import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';

import check from './check.svg';
import dropdownCaret from './dropdown-caret.svg';
import {MenuItem, Submenu} from '../menu/menu.jsx';
import {
    ACCENT_LIGHTBLUE,
    ACCENT_MAP,
    ACCENT_RED,
    ACCENT_GAIABLUE,
    ACCENT_LIME,
    ACCENT_BLUE,
    ACCENT_SCRATCH,
    ACCENT_MAGENTA,
    ACCENT_PINK,
    ACCENT_SERENEBLUE,
    ACCENT_PALEPURPLE,
    ACCENT_GOLD,
    ACCENT_SILVER,
    ACCENT_BLACK,
    ACCENT_RAINBOW,
    ACCENT_COTTON_CANDY,
    ACCENT_NEBULA,
    ACCENT_COSMIC,
    ACCENT_AURORA,
    ACCENT_MINT,
    ACCENT_CHERRY,
    Theme
} from '../../lib/themes/index.js';
import {openAccentMenu, accentMenuOpen, closeSettingsMenu} from '../../reducers/menus.js';
import {openCustomAccentModal} from '../../reducers/modals';
import {setTheme} from '../../reducers/theme.js';
import {persistTheme} from '../../lib/themes/accentPersistance.js';
import rainbowIcon from './tw-accent-rainbow.svg';
import styles from './settings-menu.css';

const options = defineMessages({
    [ACCENT_RED]: {
        defaultMessage: 'Red',
        description: 'Name of the red color scheme. Matches TurboWarp.',
        id: 'tw.accent.red'
    },
    [ACCENT_GAIABLUE]: {
        defaultMessage: 'Gaia Blue',
        description: 'Name of the blue color scheme. Used by Gaiamod by default.',
        id: 'gm.accent.gaiablue'
    },
    [ACCENT_LIME]: {
        defaultMessage: 'Lime Green',
        description: 'Name of the lime green color scheme. Matches Dinosaurmod\'s colors.',
        id: 'gm.accent.limegreen'
    },
    [ACCENT_LIGHTBLUE]: {
        defaultMessage: 'Light Blue',
        description: 'Name of the light blue color scheme. Matches Penguinmod\'s colors.',
        id: 'gm.accent.lightblue'
    },
    [ACCENT_BLUE]: {
        defaultMessage: 'Blue',
        description: 'Name of the blue color scheme. Matches Scratch before the high contrast update.',
        id: 'tw.accent.blue'
    },
    [ACCENT_SCRATCH]: {
        defaultMessage: 'Scratch',
        description: 'Name of the Scratch\'s color scheme. Matches Scratch-GUI\'s colors.',
        id: 'gm.accent.scratch'
    },
    [ACCENT_MAGENTA]: {
        defaultMessage: 'Magenta',
        description: 'Name of the magenta (sort of) color scheme. Matches Snail-IDE\'s colors.',
        id: 'gm.accent.magenta'
    },
    [ACCENT_PALEPURPLE]: {
        defaultMessage: 'Gray Purple',
        description: 'Name of the purplish grey color scheme. Matches Electramod\'s colors.',
        id: 'gm.accent.graypurple'
    },
    [ACCENT_PINK]: {
        defaultMessage: 'Pink',
        description: 'Name of the pink color scheme.',
        id: 'gm.accent.pink'
    },
    [ACCENT_SERENEBLUE]: {
        defaultMessage: 'Serene Blue',
        description: 'Name of the indigoish blue color scheme. Matches Ark IDE\'s colors.',
        id: 'gm.accent.sereneblue'
    },
    [ACCENT_GOLD]: {
        defaultMessage: 'Gold',
        description: 'Name of the gold color scheme.',
        id: 'gm.accent.gold'
    },
    [ACCENT_SILVER]: {
        defaultMessage: 'Silver',
        description: 'Name of the silver color scheme.',
        id: 'gm.accent.silver'
    },
    [ACCENT_BLACK]: {
        defaultMessage: 'Black',
        description: 'Name of the black color scheme.',
        id: 'gm.accent.black'
    },
    [ACCENT_RAINBOW]: {
        defaultMessage: 'Rainbow',
        description: 'Name of color scheme that uses a rainbow.',
        id: 'tw.accent.rainbow'
    },
    [ACCENT_COTTON_CANDY]: {
        defaultMessage: 'Cotton Candy',
        description: 'Name of color scheme that uses a cotton candy color.',
        id: 'tw.accent.cottoncandy'
    },
    [ACCENT_NEBULA]: {
        defaultMessage: 'Nebula',
        description: 'Nebula color scheme.',
        id: 'tw.accent.nebula'
    },
    [ACCENT_COSMIC]: {
        defaultMessage: 'Cosmic',
        description: 'Cosmic color scheme.',
        id: 'tw.accent.cosmic'
    },
    [ACCENT_AURORA]: {
        defaultMessage: 'Aurora',
        description: 'Aurora color scheme.',
        id: 'tw.accent.aurora'
    },
    [ACCENT_MINT]: {
        defaultMessage: 'Mint',
        description: 'Mint color scheme.',
        id: 'tw.accent.mint'
    },
    [ACCENT_CHERRY]: {
        defaultMessage: 'Cherry',
        description: 'Cherry color scheme.',
        id: 'tw.accent.cherry'
    },
    ['custom']: {
        defaultMessage: 'Custom Accent',
        description: 'Label of the button that opens a custom accent modal.',
        id: 'gm.accent.custom'
    }
});

const urlParams = new URLSearchParams(location.search);
const showSecretAccents = () => {
    return urlParams.has('newchallengersapporaching');
};

const showCreepyAccent = () => {
    return urlParams.has('666');
};

const icons = {
    [ACCENT_RAINBOW]: rainbowIcon
};

const ColorIcon = props => (
    icons[props.id] ? (
        <img
            className={styles.accentIconOuter}
            src={icons[props.id]}
            draggable={false}
            alt=""
        />
    ) : (
        <div
            className={styles.accentIconOuter}
            style={{
                backgroundColor: ACCENT_MAP[props.id]['motion-primary']
            }}
        />
    )
);

ColorIcon.propTypes = {
    id: PropTypes.string
};

const AccentMenuItem = props => (
    <MenuItem onClick={props.onClick}>
        <div className={styles.option}>
            <img
                className={classNames(styles.check, {[styles.selected]: props.isSelected})}
                width={15}
                height={12}
                src={check}
                draggable={false}
            />
            {!!props.hasIcon ? (<ColorIcon id={props.id} />) : null}
            <FormattedMessage {...options[props.id]} />
        </div>
    </MenuItem>
);

AccentMenuItem.propTypes = {
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    hasIcon: PropTypes.bool,
    onClick: PropTypes.func
};

const AccentThemeMenu = ({
    isOpen,
    isRtl,
    onChangeTheme,
    onOpen,
    onCustomAccent,
    theme
}) => (
    <MenuItem expanded={isOpen}>
        <div
            className={styles.option}
            onClick={onOpen}
        >
            <ColorIcon id={theme.accent} />
            <span className={styles.submenuLabel}>
                <FormattedMessage
                    defaultMessage="Accent"
                    description="Label for menu to choose accent color (eg. TurboWarp's red, Penguinmod's blue)"
                    id="tw.menuBar.accent"
                />
            </span>
            <img
                className={styles.expandCaret}
                src={dropdownCaret}
                draggable={false}
            />
        </div>
        <Submenu place={isRtl ? 'left' : 'right'}>
            {Object.keys(options).map(item => (
                <AccentMenuItem
                    key={item}
                    id={item}
                    isSelected={item === 'custom' ? (localStorage ? localStorage.getItem('tw:accent:isCustom') === 'true' : false) : theme.accent === item}
                    hasIcon={item !== 'custom'}
                    onClick={item === 'custom' ? () => {onCustomAccent();} : () => {onChangeTheme(theme.set(item));}}
                />
            ))}
        </Submenu>
    </MenuItem>
);

AccentThemeMenu.propTypes = {
    isOpen: PropTypes.bool,
    isRtl: PropTypes.bool,
    onChangeTheme: PropTypes.func,
    onOpen: PropTypes.func,
    onCustomAccent: PropTypes.func,
    theme: PropTypes.instanceOf(Theme)
};

const mapStateToProps = state => ({
    isOpen: accentMenuOpen(state),
    isRtl: state.locales.isRtl,
    theme: state.scratchGui.theme.theme
});

const mapDispatchToProps = dispatch => ({
    onChangeTheme: theme => {
        dispatch(setTheme(theme));
        dispatch(closeSettingsMenu());
        persistTheme(theme);
    },
    onOpen: () => dispatch(openAccentMenu()),
    onCustomAccent: () => {
        dispatch(openCustomAccentModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccentThemeMenu);
