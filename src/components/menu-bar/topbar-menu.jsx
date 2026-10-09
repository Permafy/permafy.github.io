import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import check from './check.svg';
import dropdownCaret from './dropdown-caret.svg';
import {MenuItem, Submenu} from '../menu/menu.jsx';
import styles from './settings-menu.css';

const AccentOption = ({color, isSelected, label, onClick}) => (
    <MenuItem onClick={onClick}>
        <div className={styles.option}>
            <img
                alt=""
                className={classNames(styles.check, {[styles.selected]: isSelected})}
                height={12}
                src={check}
                width={15}
                draggable={false}
            />
            <span
                className={styles.topbarColor}
                style={{backgroundColor: color}}
            />
            <span className={styles.submenuLabel}>{label}</span>
        </div>
    </MenuItem>
);

AccentOption.propTypes = {
    color: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    label: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
};

class TopbarMenu extends React.Component {
    constructor (props) {
        super(props);
        this.handleToggleTopbar = this.handleToggleTopbar.bind(this);
        this.handleToggleAccent = this.handleToggleAccent.bind(this);
        this.handleSelectPermafy = this.handleSelectPermafy.bind(this);
        this.handleSelectTurboGray = this.handleSelectTurboGray.bind(this);
        this.state = {
            topbarMenuOpen: false,
            accentMenuOpen: false
        };
    }

    handleToggleTopbar () {
        this.setState(prevState => ({
            topbarMenuOpen: !prevState.topbarMenuOpen,
            accentMenuOpen: false
        }));
    }

    handleToggleAccent () {
        this.setState(prevState => ({
            accentMenuOpen: !prevState.accentMenuOpen
        }));
    }

    handleSelectPermafy () {
        this.props.onChangeAccent('permafy');
    }

    handleSelectTurboGray () {
        this.props.onChangeAccent('turbo-gray');
    }

    render () {
        return (
            <MenuItem expanded={this.state.topbarMenuOpen}>
                <div
                    className={styles.option}
                    onClick={this.handleToggleTopbar}
                >
                    <span className={styles.submenuLabel}>
                        <FormattedMessage
                            defaultMessage="Topbar"
                            description="Settings submenu for changing the top bar."
                            id="pm.menuBar.topbar"
                        />
                    </span>
                    <img
                        className={styles.expandCaret}
                        draggable={false}
                        src={dropdownCaret}
                    />
                </div>
                <Submenu place={this.props.isRtl ? 'left' : 'right'}>
                    <MenuItem expanded={this.state.accentMenuOpen}>
                        <div
                            className={styles.option}
                            onClick={this.handleToggleAccent}
                        >
                            <span className={styles.submenuLabel}>
                                <FormattedMessage
                                    defaultMessage="Accent"
                                    description="Topbar accent color submenu."
                                    id="pm.menuBar.topbar.accent"
                                />
                            </span>
                            <img
                                className={styles.expandCaret}
                                draggable={false}
                                src={dropdownCaret}
                            />
                        </div>
                        <Submenu place={this.props.isRtl ? 'left' : 'right'}>
                            <AccentOption
                                color="#8CAFFF"
                                isSelected={this.props.accent === 'permafy'}
                                label="Permafy"
                                onClick={this.handleSelectPermafy}
                            />
                            <AccentOption
                                color="#333333"
                                isSelected={this.props.accent === 'turbo-gray'}
                                label="Turbo Gray"
                                onClick={this.handleSelectTurboGray}
                            />
                        </Submenu>
                    </MenuItem>
                </Submenu>
            </MenuItem>
        );
    }
}

TopbarMenu.propTypes = {
    accent: PropTypes.oneOf(['permafy', 'turbo-gray']).isRequired,
    isRtl: PropTypes.bool,
    onChangeAccent: PropTypes.func.isRequired
};

export default TopbarMenu;
