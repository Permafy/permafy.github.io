/**
 * Copyright (C) 2021 Thomas Weber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import {getIsLoading} from '../reducers/project-state.js';
import DOMElementRenderer from '../containers/dom-element-renderer.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import TWProjectMetaFetcherHOC from '../lib/tw-project-meta-fetcher-hoc.jsx';
import TWStateManagerHOC from '../lib/tw-state-manager-hoc.jsx';
import TWThemeHOC from '../lib/tw-theme-hoc.jsx';
import SBFileUploaderHOC from '../lib/sb-file-uploader-hoc.jsx';
import TWPackagerIntegrationHOC from '../lib/tw-packager-integration-hoc.jsx';
import SettingsStore from '../addons/settings-store-singleton';
import '../lib/tw-fix-history-api';
import GUI from './render-gui.jsx';
import VoteFrame from './vote-frame.jsx';
import MenuBar from '../components/menu-bar/menu-bar.jsx';
import ProjectInput from '../components/tw-project-input/project-input.jsx';
import FeaturedProjects from '../components/tw-featured-projects/featured-projects.jsx';
import Dashboard from '../components/dashboard/dashboard.jsx';
import Description from '../components/tw-description/description.jsx';
import BrowserModal from '../components/browser-modal/browser-modal.jsx';
import CloudVariableBadge from '../containers/tw-cloud-variable-badge.jsx';
import {isBrowserSupported} from '../lib/tw-environment-support-prober';
import AddonChannels from '../addons/channels';
import {loadServiceWorker} from './load-service-worker';
import runAddons from '../addons/entry';

import styles from './interface.css';
import restore from './restore.js';

const urlparams = new URLSearchParams(location.search);
const restoring = urlparams.get('restore');
const restoreHandler = urlparams.get('handler');
if (String(restoring) === 'true') {
    // console.log(restore)
    restore(restoreHandler);
}

let announcement = null;
if (process.env.ANNOUNCEMENT) {
    announcement = document.createElement('p');
    // This is safe because process.env.ANNOUNCEMENT is set at build time.
    announcement.innerHTML = process.env.ANNOUNCEMENT;
}

const handleClickAddonSettings = () => {
    const path = process.env.ROUTING_STYLE === 'wildcard' ? 'addons' : 'addons.html';
    window.open(`${process.env.ROOT}${path}`);
};

const xmlEscape = function (unsafe) {
    return unsafe.replace(/[<>&'"]/g, c => {
        switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        }
    });
};
const formatProjectTitle = _title => {
    const title = xmlEscape(String(_title));
    const emojiRegex = /:(\w+):/g;
    return title.replace(emojiRegex, match => {
        const emojiName = match.replace(/:/gmi, '');
        return `<img
            src="https://library.penguinmod.com/files/emojis/${emojiName}.png"
            alt=":${emojiName}:"
            title=":${emojiName}:"
            loading="lazy"
            style="width:1.75rem;vertical-align: middle;"
        >`;
    });
};

const messages = defineMessages({
    defaultTitle: {
        defaultMessage: 'Editor',
        description: 'Title of homepage',
        id: 'pm.guiDefaultTitle'
    }
});

const WrappedMenuBar = compose(
    SBFileUploaderHOC,
    TWPackagerIntegrationHOC
)(MenuBar);

if (AddonChannels.reloadChannel) {
    AddonChannels.reloadChannel.addEventListener('message', () => {
        location.reload();
    });
}

if (AddonChannels.changeChannel) {
    AddonChannels.changeChannel.addEventListener('message', e => {
        SettingsStore.setStoreWithVersionCheck(e.data);
    });
}

runAddons();

/* todo: fix this and make it work properly */
// const projectDetailCache = {};
// const getProjectDetailsById = async (id) => {
//     // if we have already gotten the details of this project, avoid making another request since they likely never changed
//     if (projectDetailCache[String(id)] != null) return projectDetailCache[String(id)];

//     // TODO: when this is fixed change this to the new api
//     const response = await fetch(`https://projects.penguinmod.com/api/projects/getPublished?id=${id}`);
//     // Don't continue if the api never returned 200-299 since we would cache an error as project details
//     if (!response.ok) return {};

//     const project = await response.json();
//     projectDetailCache[String(id)] = project;
//     return projectDetailCache[String(id)];
// };

const Footer = () => (
    <footer className={styles.footer}>
        <div className={styles.footerContent}>
            <div className={styles.footerText}>
                <FormattedMessage
                    // eslint-disable-next-line max-len
                    defaultMessage="Permafy, PenguinMod and TurboWarp are not affiliated with Scratch, the Scratch Team, or the Scratch Foundation."
                    description="Disclaimer that Permafy, PenguinMod and TurboWarp are not connected to Scratch"
                    id="tw.footer.disclaimer"
                />
            </div>
            <div className={styles.footerColumns}>
                <div className={styles.footerSection}>
                    <a href="/credits/">
                        <FormattedMessage
                            defaultMessage="Credits"
                            description="Credits link in footer"
                            id="tw.footer.credits"
                        />
                    </a>
                    <a href="https://permafy.github.io/coffee">
                        <FormattedMessage
                            defaultMessage="Donate"
                            description="Donation link in footer"
                            id="tw.footer.donate"
                        />
                    </a>
                </div>
                <div className={styles.footerSection}>
                    <a href="https://permafy.github.io/compiler">
                        {/* Do not translate */}
                        {'Permafy Compiler/Packager'}
                    </a>
                    <a href="https://desktop.turbowarp.org/">
                        {/* Do not translate */}
                        {'TurboWarp Desktop'}
                    </a>
                    <a href="https://docs.turbowarp.org/embedding">
                        <FormattedMessage
                            defaultMessage="Embedding"
                            description="Link in footer to embedding documentation for embedding link"
                            id="tw.footer.embed"
                        />
                    </a>
                    <a href="https://docs.turbowarp.org/url-parameters">
                        <FormattedMessage
                            defaultMessage="URL Parameters"
                            description="Link in footer to URL parameters documentation"
                            id="tw.footer.parameters"
                        />
                    </a>
                    <a href="https://docs.turbowarp.org/">
                        <FormattedMessage
                            defaultMessage="Documentation"
                            description="Link in footer to additional documentation"
                            id="tw.footer.documentation"
                        />
                    </a>
                </div>
                <div className={styles.footerSection}>
                    <a href="https://permafy.github.io/terms">
                        <FormattedMessage
                            defaultMessage="Terms of Service"
                            description="Link to Terms of Service"
                            id="pm.terms"
                        />
                    </a>
                    <a href="https://permafy.github.io/privacy">
                        <FormattedMessage
                            defaultMessage="Privacy Policy"
                            description="Link to privacy policy"
                            id="tw.privacy"
                        />
                    </a>
                    <a href="https://github.com/Permafy/permafy.github.io/issues">
                        <FormattedMessage
                            defaultMessage="Feedback & Bugs"
                            description="Link to feedback/bugs page"
                            id="tw.feedback"
                        />
                    </a>
                    <a href="https://github.com/Permafy">
                        <FormattedMessage
                            defaultMessage="Source Code"
                            description="Link to source code"
                            id="tw.code"
                        />
                    </a>
                </div>
            </div>
        </div>
    </footer>
);

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const numberSuffixes = [
    'st',
    'nd',
    'rd',
    'th',
    'th',
    'th',
    'th',
    'th',
    'th',
    'th'
];
const addNumberSuffix = num => {
    if (!num) return `${num}`;
    if (num < 20 && num > 10) return `${num}th`;
    return num + numberSuffixes[(num - 1) % 10];
};

class Interface extends React.Component {
    constructor (props) {
        super(props);
        this.handleUpdateProjectTitle = this.handleUpdateProjectTitle.bind(this);
        this.handleStageResizePointerDown = this.handleStageResizePointerDown.bind(this);
        this.handleStageResizePointerMove = this.handleStageResizePointerMove.bind(this);
        this.handleStageResizePointerUp = this.handleStageResizePointerUp.bind(this);
        this.handleStageResizeKeyDown = this.handleStageResizeKeyDown.bind(this);
        this.handleOpenScratchProjects = this.handleOpenScratchProjects.bind(this);
        this.rootRef = React.createRef();
        this.resizeHandleRef = React.createRef();
        this.state = {
            hideFooter: false
        };
    }
    handleOpenScratchProjects () {
        this.setState({hideFooter: true});
    }
    handleStageResizePointerDown (event) {
        event.preventDefault();
        this.isResizingStage = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        this.setStageColumnWidth(event.clientX);
    }
    handleStageResizePointerMove (event) {
        if (this.isResizingStage) {
            this.setStageColumnWidth(event.clientX);
        }
    }
    handleStageResizePointerUp (event) {
        this.isResizingStage = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }
    handleStageResizeKeyDown (event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const currentWidth = parseFloat(
            this.rootRef.current.style.getPropertyValue('--stage-column-width')
        );
        this.setStageColumnWidth(currentWidth + (event.key === 'ArrowRight' ? 24 : -24));
    }
    setStageColumnWidth (width) {
        const minWidth = 240;
        const maxWidth = Math.max(minWidth, window.innerWidth - 328);
        const newWidth = Math.max(minWidth, Math.min(width, maxWidth));
        this.rootRef.current.style.setProperty('--stage-column-width', `${newWidth}px`);
        this.resizeHandleRef.current.setAttribute('aria-valuenow', Math.round(newWidth));
    }
    componentDidUpdate (prevProps) {
        if (prevProps.isLoading && !this.props.isLoading) {
            loadServiceWorker();
        }
    }
    handleUpdateProjectTitle (title, isDefault) {
        if (isDefault || !title) {
            document.title = `Permafy - ${this.props.intl.formatMessage(messages.defaultTitle)}`;
        } else {
            document.title = `${title} - Permafy`;
        }
    }
    copyProjectLink (id) {
        if ('clipboard' in navigator && 'writeText' in navigator.clipboard) {
            navigator.clipboard.writeText(`https://projects.penguinmod.com/${id}`);
        }
    }
    render () {
        const {
            /* eslint-disable no-unused-vars */
            intl,
            hasCloudVariables,
            title,
            description,
            extraProjectInfo,
            remixedProjectInfo,
            isFullScreen,
            isLoading,
            isPlayerOnly,
            isRtl,
            onClickTheme,
            projectId,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        const isHomepage = isPlayerOnly && !isFullScreen;
        const isEditor = !isPlayerOnly;
        const showDashboard = isHomepage && !/(?:^|\/)featured\/?$/.test(window.location.pathname);
        const defaultStageColumnWidth = Math.min(
            Math.max(480, props.customStageSize.width) + 2,
            window.innerWidth / 2
        );
        const isUpdated = extraProjectInfo.isUpdated;
        const projectReleaseYear = extraProjectInfo.releaseDate.getFullYear();
        const projectReleaseMonth = monthNames[extraProjectInfo.releaseDate.getMonth()];
        const projectReleaseDay = addNumberSuffix(extraProjectInfo.releaseDate.getDate());
        const hour24 = extraProjectInfo.releaseDate.getHours();
        const projectReleaseHour = hour24 === 0 ? 12 : (hour24 > 12 ? hour24 - 12 : hour24);
        const projectReleaseHalf = extraProjectInfo.releaseDate.getHours() > 11
            ? 'PM'
            : 'AM';
        const projectReleaseMinute = extraProjectInfo.releaseDate.getMinutes();
        return (
            <div
                className={classNames(styles.container, {
                    [styles.playerOnly]: isHomepage,
                    [styles.editor]: isEditor,
                    [styles.splitHomepage]: showDashboard
                })}
                style={showDashboard ? {
                    '--stage-column-width': `${defaultStageColumnWidth}px`
                } : null}
                ref={this.rootRef}
            >
                {showDashboard && (
                    <div className={styles.siteMenu}>
                        <WrappedMenuBar
                            canChangeLanguage
                            canManageFiles
                            enableSeeInside
                            onClickAddonSettings={handleClickAddonSettings}
                            onClickTheme={onClickTheme}
                        />
                    </div>
                )}
                <div className={styles.homepageEditor}>
                    {isHomepage && !showDashboard ? (
                        <div className={styles.menu}>
                            <WrappedMenuBar
                                canChangeLanguage
                                canManageFiles
                                enableSeeInside
                                onClickAddonSettings={handleClickAddonSettings}
                                onClickTheme={onClickTheme}
                            />
                        </div>
                    ) : null}
                    <div
                        className={styles.center}
                        style={isPlayerOnly ? ({
                            // add a couple pixels to account for border (TODO: remove weird hack)
                            width: `${Math.max(480, props.customStageSize.width) + 2}px`
                        }) : null}
                    >
                    {isHomepage && announcement ? <DOMElementRenderer domElement={announcement} /> : null}
                    {isHomepage && projectId !== '0' && title && extraProjectInfo && extraProjectInfo.author && <div className={styles.projectDetails}>
                        <a
                            target="_blank"
                            href={`https://penguinmod.com/profile?user=${extraProjectInfo.author}`}
                            rel="noreferrer"
                        >
                            <img
                                className={styles.projectAuthorImage}
                                title={extraProjectInfo.author}
                                alt={extraProjectInfo.author}
                                src={`https://projects.penguinmod.com/api/v1/users/getpfp?username=${extraProjectInfo.author}`}
                            />
                        </a>
                        <div className={styles.projectMetadata}>
                            <h2 dangerouslySetInnerHTML={{__html: formatProjectTitle(title)}} />
                            <p>by <a
                                target="_blank"
                                href={`https://penguinmod.com/profile?user=${extraProjectInfo.author}`}
                                rel="noreferrer"
                            >{extraProjectInfo.author}</a></p>
                        </div>
                    </div>}
                    <GUI
                        onClickAddonSettings={handleClickAddonSettings}
                        onClickTheme={onClickTheme}
                        onUpdateProjectTitle={this.handleUpdateProjectTitle}
                        backpackVisible
                        backpackHost="_local_"
                        {...props}
                    />
                    {isHomepage ? (
                        <React.Fragment>
                            {/* project not approved message */}
                            {(!extraProjectInfo.accepted) && (
                                <div className={styles.remixWarningBox}>
                                    <p>
                                        This project is currently under review.
                                        Content may not be suitable for all ages,
                                        and you should be careful when running the project.
                                    </p>
                                </div>
                            )}
                            {/* remix info */}
                            {(extraProjectInfo.isRemix && remixedProjectInfo.loaded) && (
                                <div className={styles.unsharedUpdate}>
                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                        <a
                                            style={{height: '32px'}}
                                            target="_blank"
                                            href={`https://penguinmod.com/profile?user=${remixedProjectInfo.author}`}
                                            rel="noreferrer"
                                        >
                                            <img
                                                className={styles.remixAuthorImage}
                                                title={remixedProjectInfo.author}
                                                alt={remixedProjectInfo.author}
                                                src={`https://projects.penguinmod.com/api/v1/users/getpfp?username=${remixedProjectInfo.author}`}
                                            />
                                        </a>
                                        <p>
                                            Thanks to <b>
                                                <a
                                                    target="_blank"
                                                    href={`https://penguinmod.com/profile?user=${remixedProjectInfo.author}`}
                                                    rel="noreferrer"
                                                >
                                                    {remixedProjectInfo.author}
                                                </a>
                                            </b> for the original project <b>
                                                <a
                                                    href={`${window.location.origin}/#${extraProjectInfo.remixId}`}
                                                >
                                                    {remixedProjectInfo.name}
                                                </a>
                                            </b>.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {isBrowserSupported() ? null : (
                                <BrowserModal isRtl={isRtl} />
                            )}
                            {hasCloudVariables && projectId !== '0' && (
                                <div className={styles.section}>
                                    <CloudVariableBadge />
                                </div>
                            )}
                            {description.instructions || description.credits ? (
                                <div className={styles.section}>
                                    <Description
                                        instructions={description.instructions}
                                        credits={description.credits}
                                        projectId={projectId}
                                    />
                                </div>
                            ) : null}
                            {extraProjectInfo.author && (
                                <VoteFrame
                                    id={projectId}
                                    darkmode={this.props.isDark}
                                />
                            )}
                            {projectId !== '0' && extraProjectInfo.author && (
                                <div>
                                    {isUpdated ?
                                        <div>
                                            <FormattedMessage
                                                defaultMessage="Updated {date}"
                                                description="The date at which the project was updated"
                                                id="pm.projectFooter.updatedAt"
                                                values={{
                                                    date: extraProjectInfo.releaseDate.toLocaleString(),
                                                }}
                                            />
                                            <br></br>
                                            <div style={{ fontSize: "15px", color: "#7a7a7a" }}>
                                                <FormattedMessage
                                                    defaultMessage="Originally Uploaded {date}"
                                                    description="The date at which the project was uploaded"
                                                    id="pm.projectFooter.originallyUploadedAt"
                                                    
                                                    values={{
                                                        date: extraProjectInfo.uploadDate.toLocaleString(),
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        : <FormattedMessage
                                            defaultMessage="Uploaded {date}"
                                            description="The date at which the project was uploaded"
                                            id="pm.projectFooter.uploadedAt"
                                            values={{
                                                date: extraProjectInfo.releaseDate.toLocaleString()
                                            }}
                                        />}
                                    <div className={styles.centerSector}>
                                        <button
                                            onClick={() => this.copyProjectLink(projectId)}
                                            className={styles.shareLink}
                                        >
                                            <img
                                                src="/share_project.png"
                                                alt=">"
                                            />
                                            <FormattedMessage
                                                defaultMessage="Copy Link"
                                                description="Copy project share link button"
                                                id="pm.projectFooter.copyLink"
                                            />
                                        </button>
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href={`https://penguinmod.com/report?type=project&id=${projectId}`}
                                            className={styles.reportLink}
                                        >
                                            <img
                                                src="report_flag.png"
                                                alt="!"
                                            />
                                            <FormattedMessage
                                                defaultMessage="Report"
                                                description="Report project button in the project viewer"
                                                id="pm.projectFooter.reportProject"
                                            />
                                        </a>
                                    </div>
                                </div>
                            )}
                            <div className={styles.section}>
                                <FeaturedProjects onOpenProjects={this.handleOpenScratchProjects} />
                            </div>
                        </React.Fragment>
                    ) : null}
                    </div>
                    {isHomepage && !this.state.hideFooter && <Footer />}
                </div>
                {showDashboard && (
                    <div
                        className={styles.resizeHandle}
                        onPointerDown={this.handleStageResizePointerDown}
                        onPointerMove={this.handleStageResizePointerMove}
                        onPointerUp={this.handleStageResizePointerUp}
                        onPointerCancel={this.handleStageResizePointerUp}
                        onKeyDown={this.handleStageResizeKeyDown}
                        ref={this.resizeHandleRef}
                        role="separator"
                        aria-label="Resize editor and dashboard"
                        aria-orientation="vertical"
                        aria-valuemin="240"
                        aria-valuenow={Math.round(defaultStageColumnWidth)}
                        tabIndex="0"
                    />
                )}
                {showDashboard && (
                    <div className={styles.dashboardPane}>
                        <Dashboard language={intl.locale} />
                    </div>
                )}
            </div>
        );
    }
}

Interface.propTypes = {
    intl: intlShape,
    hasCloudVariables: PropTypes.bool,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    description: PropTypes.shape({
        credits: PropTypes.string,
        instructions: PropTypes.string
    }),
    extraProjectInfo: PropTypes.shape({
        accepted: PropTypes.bool,
        isRemix: PropTypes.bool,
        remixId: PropTypes.string,
        tooLarge: PropTypes.bool,
        author: PropTypes.string,
        releaseDate: PropTypes.shape(Date),
        isUpdated: PropTypes.bool
    }),
    remixedProjectInfo: PropTypes.shape({
        loaded: PropTypes.bool,
        name: PropTypes.string,
        author: PropTypes.string
    }),
    isFullScreen: PropTypes.bool,
    isLoading: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    onClickTheme: PropTypes.func,
    projectId: PropTypes.string
};

const mapStateToProps = state => ({
    hasCloudVariables: state.scratchGui.tw.hasCloudVariables,
    customStageSize: state.scratchGui.customStageSize,
    title: state.scratchGui.projectTitle,
    description: state.scratchGui.tw.description,
    extraProjectInfo: state.scratchGui.tw.extraProjectInfo,
    remixedProjectInfo: state.scratchGui.tw.remixedProjectInfo,
    isFullScreen: state.scratchGui.mode.isFullScreen,
    isLoading: getIsLoading(state.scratchGui.projectState.loadingState),
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
    isRtl: state.locales.isRtl,
    projectId: state.scratchGui.projectState.projectId
});

const mapDispatchToProps = () => ({});

const ConnectedInterface = injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(Interface));

const WrappedInterface = compose(
    AppStateHOC,
    ErrorBoundaryHOC('TW Interface'),
    TWProjectMetaFetcherHOC,
    TWStateManagerHOC,
    TWThemeHOC,
    TWPackagerIntegrationHOC
)(ConnectedInterface);

export default WrappedInterface;
