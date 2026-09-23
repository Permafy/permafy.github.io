import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import StudioView from '../tw-studioview/studioview.jsx';
import styles from './featured-projects.css';
import { setProjectId } from '../../lib/tw-navigation-utils.js';
import classNames from 'classnames';

class FeaturedProjects extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleSelect',
            'handleOpenProjects',
            'handleToggleSource',
            'handleLoadMore',
            'handleStudioReady'
        ]);
        this.state = {
            opened: false,
            transition: true,
            source: 'penguinmod'
        };
    }
    componentDidUpdate(prevProps) {
        if (this.props.projectId === '0' && prevProps.projectId === null) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                opened: true,
                transition: false
            });
        }
    }
    handleSelect(id) {
        const root = process.env.ROOT || '/';
        const siteRoot = root.endsWith('/') ? root : `${root}/`;
        window.location.href = `${siteRoot}${this.state.source}/#${id}`;
    }
    handleOpenProjects() {
        this.setState({
            opened: true
        });
    }
    handleToggleSource() {
        this.setState({
            source: this.state.source === 'penguinmod' ? 'scratch' : 'penguinmod',
            opened: true
        });
    }
    handleStudioReady(studioView) {
        this.studioView = studioView;
    }
    handleLoadMore() {
        if (this.studioView && this.studioView.canLoadNext()) {
            this.studioView.loadNextPage();
        }
    }
    render() {
        const opened = this.state.opened;
        return (
            <div className={styles.container}>
                <div
                    className={classNames(
                        styles.projects,
                        {
                            [styles.opened]: opened,
                            [styles.transition]: this.state.transition
                        }
                    )}
                >
                    <StudioView
                        key={this.state.source}
                        onSelect={this.handleSelect}
                        onReady={this.handleStudioReady}
                        placeholder={!opened}
                        source={this.state.source}
                    />
                    {opened ? null : (
                        <div
                            className={styles.openerContainer}
                            onClick={this.handleOpenProjects}
                        >
                            <div className={styles.openerContent}>
                                <FormattedMessage
                                    defaultMessage="Click to view PenguinMod projects."
                                    description="View featured PenguinMod projects"
                                    id="tw.PMviewFeaturedProjects"
                                />
                            </div>
                        </div>
                    )}
                </div>
                <button
                    className={styles.sourceButton}
                    onClick={this.handleToggleSource}
                    type="button"
                >
                    {this.state.source === 'penguinmod' ? (
                        <FormattedMessage
                            defaultMessage="View Scratch projects instead"
                            description="Button to switch to Scratch featured projects"
                            id="tw.PMviewScratchFeaturedProjects"
                        />
                    ) : (
                        <FormattedMessage
                            defaultMessage="View PenguinMod projects instead"
                            description="Button to switch to PenguinMod featured projects"
                            id="tw.PMviewPenguinModFeaturedProjects"
                        />
                    )}
                </button>
                <button
                    className={styles.sourceButton}
                    onClick={this.handleLoadMore}
                    type="button"
                >
                    See more projects
                </button>
            </div>
        );
    }
}

FeaturedProjects.propTypes = {
    setProjectId: PropTypes.func,
    projectId: PropTypes.string,
    studio: PropTypes.string
};

const mapStateToProps = state => ({
    projectId: state.scratchGui.projectState.projectId
});

const mapDispatchToProps = dispatch => ({
    setProjectId: projectId => setProjectId(dispatch, projectId)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FeaturedProjects);
