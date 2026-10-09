import PropTypes from 'prop-types';
import React from 'react';
import Menu from '../../containers/menu.jsx';

const MenuBarMenu = ({
    children,
    className,
    ignoreClickOutsideSelector,
    onRequestClose,
    open,
    place = 'right'
}) => (
    <div className={className}>
        <Menu
            open={open}
            place={place}
            ignoreClickOutsideSelector={ignoreClickOutsideSelector}
            onRequestClose={onRequestClose}
        >
            {children}
        </Menu>
    </div>
);

MenuBarMenu.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    ignoreClickOutsideSelector: PropTypes.string,
    onRequestClose: PropTypes.func,
    open: PropTypes.bool,
    place: PropTypes.oneOf(['left', 'right'])
};

export default MenuBarMenu;
