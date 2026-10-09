import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import Box from '../box/box.jsx';
import styles from './blocks.css';

const BlocksComponent = props => {
    const {
        containerRef,
        dragOver,
        onSearchChange,
        searchPlaceholder,
        searchQuery,
        ...componentProps
    } = props;
    return (
        <Box
            className={classNames(styles.blocks, {
                [styles.dragOver]: dragOver
            })}
            {...componentProps}
            componentRef={containerRef}
        >
            <input
                aria-label={searchPlaceholder}
                className={styles.search}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                type="search"
                value={searchQuery}
            />
        </Box>
    );
};
BlocksComponent.propTypes = {
    containerRef: PropTypes.func,
    dragOver: PropTypes.bool,
    onSearchChange: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    searchQuery: PropTypes.string
};
export default BlocksComponent;
