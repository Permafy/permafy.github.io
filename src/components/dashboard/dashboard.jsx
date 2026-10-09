import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import normalizeBasePath from '../../lib/normalize-base-path';
import styles from './dashboard.css';

class Dashboard extends React.Component {
    constructor (props) {
        super(props);
        this.frameRef = React.createRef();
        this.syncLanguage(props.language);
        bindAll(this, [
            'handleFrameLoad',
            'handleProjectClick'
        ]);
    }
    componentDidUpdate (prevProps) {
        if (prevProps.language !== this.props.language) {
            this.syncLanguage(this.props.language);
            if (this.frameDocument) {
                this.frameRef.current.contentWindow.location.reload();
            }
        }
    }
    componentWillUnmount () {
        if (this.frameDocument) {
            this.frameDocument.removeEventListener('click', this.handleProjectClick, true);
        }
    }
    handleFrameLoad (event) {
        if (this.frameDocument) {
            this.frameDocument.removeEventListener('click', this.handleProjectClick, true);
        }
        this.frameDocument = event.currentTarget.contentDocument;
        if (this.frameDocument) {
            this.frameDocument.addEventListener('click', this.handleProjectClick, true);
        }
    }
    syncLanguage (language) {
        const settingsKey = 'pm:settings';
        const settingsValue = window.localStorage.getItem(settingsKey);
        let settings = {};
        if (settingsValue) {
            try {
                settings = JSON.parse(settingsValue);
            } catch (error) {
                console.error('Could not read dashboard settings while syncing the Permafy language.', error);
            }
        }
        settings.appLanguage = language || 'en';
        window.localStorage.setItem(settingsKey, JSON.stringify(settings));
    }
    handleProjectClick (event) {
        const target = event.target.nodeType === 1 ? event.target : event.target.parentElement;
        const link = target && target.closest('a[href]');
        if (!link) return;

        const targetUrl = new URL(link.href);
        const projectId = targetUrl.hash.match(/^#(\d+)$/);
        if (!projectId || !/(^|\.)penguinmod\.com$/i.test(targetUrl.hostname)) return;

        event.preventDefault();
        window.location.assign(`${normalizeBasePath(process.env.ROOT)}penguinmod/#${projectId[1]}`);
    }
    render () {
        return (
            <iframe
                className={styles.frame}
                onLoad={this.handleFrameLoad}
                ref={this.frameRef}
                src={`${normalizeBasePath(process.env.ROOT)}dashboard/`}
                title="Permafy dashboard"
            />
        );
    }
}

Dashboard.propTypes = {
    language: PropTypes.string
};

Dashboard.defaultProps = {
    language: 'en'
};

export default Dashboard;
