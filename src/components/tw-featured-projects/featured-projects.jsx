import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import StudioView from '../tw-studioview/studioview.jsx';
import styles from './featured-projects.css';
import classNames from 'classnames';

// i probably should change/add IDs
// the final url will be /featured/#<ID> and that points to the project in PenguinMod
// a
// a
// featuring: 3854350626 as beXureOS Alpha4 by itzshowkun
// featuring: 6299879522 as cubicles by powertrip777
// featuring: 0606152409 as IceOS 1.0 by totallynotpenguinz (i love those OS projects)
// a
// a
// adding more later!
const FEATURED_PROJECT_IDS = [
    '3854350626',
    '6299879522',
    '0606152409',
    '2629896790'
];

const isFeaturedPage = () => {
    const path = window.location.pathname.replace(/\/+$/, '');
    return path === '/featured' || path.endsWith('/featured');
};

const getSiteRoot = () => {
    const root = process.env.ROOT || '/';
    return root.endsWith('/') ? root : `${root}/`;
};

const getFeaturedPageUrl = () => {
    const root = process.env.ROOT || '/';
    const normalizedRoot = root === '/' ? '/' : root.endsWith('/') ? root : `${root}/`;
    const baseUrl = normalizedRoot.startsWith('http')
        ? normalizedRoot
        : `${window.location.origin}${normalizedRoot}`;
    return new URL('featured/', baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).toString();
};

class FeaturedProjects extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleSelect',
            'handleOpenProjects',
            'handleOpenFeatured',
            'handleLoadMore',
            'handleStudioReady'
        ]);
        this.state = {
            opened: false,
            transition: true,
            source: 'scratch'
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
        const siteRoot = getSiteRoot();
        const page = isFeaturedPage() ? 'featured' : this.state.source;
        window.location.href = `${siteRoot}${page}/#${id}`;
    }
    handleOpenProjects() {
        this.setState({
            opened: true
        });
        if (this.props.onOpenProjects) this.props.onOpenProjects();
    }
    handleOpenFeatured() {
        window.location.assign(getFeaturedPageUrl());
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
        const featuredPage = isFeaturedPage();
        const isOpen = featuredPage || opened;
        const featuredProjectIds = featuredPage && FEATURED_PROJECT_IDS.length > 0 ? FEATURED_PROJECT_IDS : null;

        return (
            <div className={styles.container}>
                <div
                    className={classNames(
                        styles.projects,
                        {
                            [styles.opened]: isOpen,
                            [styles.transition]: this.state.transition
                        }
                    )}
                >
                    <StudioView
                        key={featuredPage ? 'featured' : this.state.source}
                        onSelect={this.handleSelect}
                        onReady={this.handleStudioReady}
                        placeholder={!isOpen}
                        source={featuredPage ? 'penguinmod' : this.state.source}
                        customProjectIds={featuredProjectIds}
                    />
                    {!featuredPage && !opened && (
                        <div
                            className={styles.openerContainer}
                            onClick={this.handleOpenProjects}
                        >
                            <div className={styles.openerContent}>
                                <FormattedMessage
                                    defaultMessage="Click to view Scratch projects."
                                    description="Open Scratch projects"
                                    id="tw.viewScratchProjects"
                                />
                            </div>
                        </div>
                    )}
                </div>
                {!featuredPage && (
                    <button
                        className={styles.sourceButton}
                        onClick={this.handleOpenFeatured}
                        type="button"
                    >
                        <FormattedMessage
                            defaultMessage="View Featured Projects Instead"
                            description="Open the featured projects page"
                            id="tw.viewFeaturedProjectsInstead"
                        />
                    </button>
                )}
            </div>
        );
    }
}

FeaturedProjects.propTypes = {
    onOpenProjects: PropTypes.func,
    projectId: PropTypes.string
};

const mapStateToProps = state => ({
    projectId: state.scratchGui.projectState.projectId
});

export default connect(mapStateToProps)(FeaturedProjects);
