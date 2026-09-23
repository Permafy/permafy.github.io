import React from "react";
import PropTypes from "prop-types";
import { intlShape, injectIntl } from "react-intl";
import bindAll from "lodash.bindall";
import { connect } from "react-redux";
import JSZip from "jszip";
import { protobufToJson } from "pmp-protobuf";

import { setProjectUnchanged } from "../reducers/project-changed";
import {
    LoadingStates,
    getIsCreatingNew,
    getIsFetchingWithId,
    getIsLoading,
    getIsShowingProject,
    onFetchedProjectData,
    projectError,
    setProjectId,
} from "../reducers/project-state";
import { activateTab, BLOCKS_TAB_INDEX } from "../reducers/editor-tab";

import log from "./log";
import storage from "./storage";

import { MISSING_PROJECT_ID } from "./tw-missing-project";
import VM from "scratch-vm";
import * as progressMonitor from "../components/loader/tw-progress-monitor";

/* Higher Order Component to provide behavior for loading projects by id. If
 * there's no id, the default project is loaded.
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const ProjectFetcherHOC = function (WrappedComponent) {
    class ProjectFetcherComponent extends React.Component {
        constructor(props) {
            super(props);
            bindAll(this, ["fetchProject"]);
            storage.setProjectHost(props.projectHost);
            storage.setProjectToken(props.projectToken);
            storage.setAssetHost(props.assetHost);
            storage.setTranslatorFunction(props.intl.formatMessage);
            // props.projectId might be unset, in which case we use our default;
            // or it may be set by an even higher HOC, and passed to us.
            // Either way, we now know what the initial projectId should be, so
            // set it in the redux store.
            if (
                props.projectId !== "" &&
                props.projectId !== null &&
                typeof props.projectId !== "undefined"
            ) {
                this.props.setProjectId(props.projectId.toString());
            }
        }
        componentDidUpdate(prevProps) {
            if (prevProps.projectHost !== this.props.projectHost) {
                storage.setProjectHost(this.props.projectHost);
            }
            if (prevProps.projectToken !== this.props.projectToken) {
                storage.setProjectToken(this.props.projectToken);
            }
            if (prevProps.assetHost !== this.props.assetHost) {
                storage.setAssetHost(this.props.assetHost);
            }
            if (this.props.isFetchingWithId && !prevProps.isFetchingWithId) {
                this.fetchProject(
                    this.props.reduxProjectId,
                    this.props.loadingState,
                );
            }
            if (this.props.isShowingProject && !prevProps.isShowingProject) {
                this.props.onProjectUnchanged();
            }
            if (
                this.props.isShowingProject &&
                (prevProps.isLoadingProject || prevProps.isCreatingNew)
            ) {
                this.props.onActivateTab(BLOCKS_TAB_INDEX);
            }
        }

        fetchProject(projectId, loadingState) {
            // tw: clear and stop the VM before fetching
            // these will also happen later after the project is fetched, but fetching may take a while and
            // the project shouldn't be running while fetching the new project
            this.props.vm.clear();
            this.props.vm.stop();

            // pm: clear url params when fetching if the project ID is 'default'
            if (
                loadingState === "FETCHING_NEW_DEFAULT" &&
                (projectId == 0 || projectId === null)
            ) {
                this.props.vm.setFramerate(30);
                this.props.vm.setRuntimeOptions({
                    disableDirectionClamping: false,
                    dangerousOptimizations: false,
                    disableOffscreenRendering: false,
                    fencing: true,
                    maxClones: 300,
                    miscLimits: true,
                });
            }
            let assetPromise;
            // In case running in node...
            let projectUrl =
                typeof URLSearchParams === "undefined"
                    ? null
                    : new URLSearchParams(location.search).get("project_url");
            if (projectUrl) {
                if (
                    !projectUrl.startsWith("http:") &&
                    !projectUrl.startsWith("https:")
                ) {
                    projectUrl = `https://${projectUrl}`;
                }

                assetPromise = progressMonitor
                    .fetchWithProgress(projectUrl)
                    .then((r) => {
                        if (
                            this.props.vm.runtime.renderer?.setPrivateSkinAccess
                        )
                            this.props.vm.runtime.renderer.setPrivateSkinAccess(
                                false,
                            );
                        if (!r.ok) {
                            throw new Error(
                                `Request returned status ${r.status}`,
                            );
                        }
                        return r.arrayBuffer();
                    })
                    .then((buffer) => ({ data: buffer }));
            } else {
                // patch for default project
                if (projectId === "0") {
                    storage.setProjectToken(projectId);
                    assetPromise = storage.load(
                        storage.AssetType.Project,
                        projectId,
                        storage.DataFormat.JSON,
                    );
                } else {
                    assetPromise = storage.load(
                        storage.AssetType.Project,
                        projectId,
                        storage.DataFormat.JSON,
                    );
                    storage.setProjectID(projectId);
                }
            }

            return assetPromise
                .then((projectAsset) => {
                    console.log(`project asset: ${projectAsset}`);

                    // pm: If the project data is missing, it *probably* doesn't exist
                    // (barring some bad internet connection, which I don't feel like accounting for),
                    // and the "missing project" project should be loaded instead.
                    // TODO: have the server send an explicit "this doesn't exist"
                    if (!projectAsset) {
                        return storage.load(
                            storage.AssetType.Project,
                            MISSING_PROJECT_ID,
                            storage.DataFormat.JSON,
                        );
                    }
                    return projectAsset;
                })
                .then((projectAsset) => {
                    if (projectAsset) {
                        let projectData = projectAsset.data;
                        if (projectId !== "0" && !projectUrl) {
                            const projectText = new TextDecoder().decode(projectAsset.data);
                            try {
                                projectData = JSON.parse(projectText);
                            } catch (error) {
                                projectData = protobufToJson(projectAsset.data);
                            }
                        }
                        this.props.onFetchedProjectData(
                            projectData,
                            loadingState,
                        );
                    } else {
                        throw new Error("Failed to load project.");
                    }
                })
                .catch((err) => {
                    this.props.onError(err);
                    log.error(err);
                });
        }
        render() {
            const {
                /* eslint-disable no-unused-vars */
                assetHost,
                intl,
                isLoadingProject: isLoadingProjectProp,
                loadingState,
                onActivateTab,
                onError: onErrorProp,
                onFetchedProjectData: onFetchedProjectDataProp,
                onProjectUnchanged,
                projectHost,
                projectId,
                reduxProjectId,
                setProjectId: setProjectIdProp,
                /* eslint-enable no-unused-vars */
                isFetchingWithId: isFetchingWithIdProp,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    fetchingProject={isFetchingWithIdProp}
                    {...componentProps}
                />
            );
        }
    }
    ProjectFetcherComponent.propTypes = {
        assetHost: PropTypes.string,
        canSave: PropTypes.bool,
        intl: intlShape.isRequired,
        isCreatingNew: PropTypes.bool,
        isFetchingWithId: PropTypes.bool,
        isLoadingProject: PropTypes.bool,
        isShowingProject: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        onActivateTab: PropTypes.func,
        onError: PropTypes.func,
        onFetchedProjectData: PropTypes.func,
        onProjectUnchanged: PropTypes.func,
        projectHost: PropTypes.string,
        projectToken: PropTypes.string,
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        reduxProjectId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        setProjectId: PropTypes.func,
        vm: PropTypes.instanceOf(VM),
    };
    ProjectFetcherComponent.defaultProps = {
        assetHost:
            "https://asset-cdn.penguinmod.com/file/penguinmod-warm-tier-s2-cf",
        projectHost:
            "https://projects.penguinmod.com/api/v1/projects/getProject?requestType=protobuf&projectID",
    };

    const mapStateToProps = (state) => ({
        isCreatingNew: getIsCreatingNew(
            state.scratchGui.projectState.loadingState,
        ),
        isFetchingWithId: getIsFetchingWithId(
            state.scratchGui.projectState.loadingState,
        ),
        isLoadingProject: getIsLoading(
            state.scratchGui.projectState.loadingState,
        ),
        isShowingProject: getIsShowingProject(
            state.scratchGui.projectState.loadingState,
        ),
        loadingState: state.scratchGui.projectState.loadingState,
        reduxProjectId: state.scratchGui.projectState.projectId,
        vm: state.scratchGui.vm,
    });
    const mapDispatchToProps = (dispatch) => ({
        onActivateTab: (tab) => dispatch(activateTab(tab)),
        onError: (error) => dispatch(projectError(error)),
        onFetchedProjectData: (projectData, loadingState) => {
            dispatch(onFetchedProjectData(projectData, loadingState));
        },
        setProjectId: (projectId) => dispatch(setProjectId(projectId)),
        onProjectUnchanged: () => dispatch(setProjectUnchanged()),
    });
    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) =>
        Object.assign({}, stateProps, dispatchProps, ownProps);
    return injectIntl(
        connect(
            mapStateToProps,
            mapDispatchToProps,
            mergeProps,
        )(ProjectFetcherComponent),
    );
};

export { ProjectFetcherHOC as default };
