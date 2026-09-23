import PropTypes from 'prop-types';
import React from 'react';

import locales from '@turbowarp/scratch-l10n';
import styles from './language-selector.css';

const supportedLanguages = ['en', 'es'];

const LanguageSelector = ({currentLocale, label, onChange}) => (
    <select
        aria-label={label}
        className={styles.languageSelect}
        value={currentLocale}
        onChange={onChange}
    >
        {
            Object.keys(locales)
                .filter(l => supportedLanguages.includes(l))
                .map(locale => (
                    <option
                        key={locale}
                        value={locale}
                    >
                        {locales[locale].name}
                    </option>
                ))
        }
    </select>
);

LanguageSelector.propTypes = {
    currentLocale: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func
};

export default LanguageSelector;
