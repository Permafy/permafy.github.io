import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import { defineMessages, intlShape, injectIntl } from 'react-intl';
import VM from 'scratch-vm';
import { connect } from 'react-redux';

import AssetPanel from '../components/asset-panel/asset-panel.jsx';
import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import DragConstants from '../lib/drag-constants';
import downloadBlob from '../lib/download-blob';
import { showStandardAlert, closeAlertWithId } from '../reducers/alerts';

import fileUploadIcon from '../components/action-menu/icon--file-upload.svg';
import addNewTxtFileIcon from '../components/asset-panel/icon--add-blank-costume.svg';

const formatSize = bytes => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < Math.pow(1024, 2)) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < Math.pow(1024, 3)) return `${(bytes / Math.pow(1024, 2)).toFixed(2)} MB`;
    return `${(bytes / Math.pow(1024, 3)).toFixed(2)} GB`;
};

const messages = defineMessages({
    fileUploadAsset: {
        defaultMessage: 'Upload Asset',
        description: 'Button to upload asset from file in the editor tab',
        id: 'gui.assetTab.fileUploadAsset'
    },
    newTextFile: {
        defaultMessage: 'New Text File',
        description: 'Button to create a blank text file in the asset tab',
        id: 'gui.assetTab.newTextFile'
    },
    newTextFileName: {
        defaultMessage: 'file',
        description: 'Default name for new blank text files in the asset tab',
        id: 'gui.assetTab.newTextFileName'
    }
});

class AssetTab extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleSelectAsset',
            'handleDeleteAsset',
            'handleDuplicateAsset',
            'handleExportAsset',
            'handleCreateBlankTextAsset',
            'handleFileUploadClick',
            'handleAssetUpload',
            'setFileInput',
            'getExtraAssets',
            'getUniqueAssetName',
            'reportAssetError'
        ]);
        this.state = { selectedAssetIndex: 0, uploadError: null };
        this.fileInput = null;
    }

    getExtraAssets() {
        const files = this.props.vm._projectZip.files;
        return Object.values(files)
            .filter(file => !file.dir && file.name.startsWith('extraAssets/'))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    getUniqueAssetName(fileName) {
        const safeFileName = fileName.split(/[\\/]/).pop() || 'asset';
        const existingNames = new Set(this.getExtraAssets().map(file => file.name));
        const extensionIndex = safeFileName.lastIndexOf('.');
        const baseName = extensionIndex > 0 ? safeFileName.slice(0, extensionIndex) : safeFileName;
        const extension = extensionIndex > 0 ? safeFileName.slice(extensionIndex) : '';
        let name = `extraAssets/${safeFileName}`;
        let suffix = 2;

        while (existingNames.has(name)) {
            name = `extraAssets/${baseName} (${suffix})${extension}`;
            suffix += 1;
        }

        return name;
    }

    reportAssetError(error) {
        console.error('Unable to process asset:', error);
        this.setState({ uploadError: error.message || String(error) });
    }

    handleSelectAsset(assetIndex) {
        this.setState({ selectedAssetIndex: assetIndex });
    }

    handleDeleteAsset(assetIndex) {
        const { vm } = this.props;
        const asset = this.getExtraAssets()[assetIndex];
        if (!asset) return;
        vm._projectZip.remove(asset.name);
        vm.runtime.emitProjectChanged();
        this.setState({ selectedAssetIndex: Math.max(0, assetIndex - 1) });
    }

    async handleDuplicateAsset(assetIndex) {
        const { vm } = this.props;
        const asset = this.getExtraAssets()[assetIndex];
        if (!asset) return;
        try {
            const data = await asset.async('uint8array');
            const name = this.getUniqueAssetName(asset.name.substring('extraAssets/'.length));
            vm._projectZip.file(name, data);
            vm.runtime.emitProjectChanged();
            this.setState({ selectedAssetIndex: this.getExtraAssets().length - 1 });
        } catch (error) {
            this.reportAssetError(error);
        }
    }

    async handleExportAsset(assetIndex) {
        const asset = this.getExtraAssets()[assetIndex];
        if (!asset) return;
        try {
            const data = await asset.async('uint8array');
            downloadBlob(asset.name.substring('extraAssets/'.length), new Blob([data]));
        } catch (error) {
            this.reportAssetError(error);
        }
    }

    handleCreateBlankTextAsset() {
        const { vm, intl } = this.props;
        const name = this.getUniqueAssetName(`${intl.formatMessage(messages.newTextFileName)}.txt`);
        vm._projectZip.file(name, '');
        vm.runtime.emitProjectChanged();
        this.setState({ selectedAssetIndex: this.getExtraAssets().length - 1 });
    }

    handleFileUploadClick() {
        if (this.fileInput) this.fileInput.click();
    }

    async handleAssetUpload(event) {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        const { vm } = this.props;
        this.setState({ uploadError: null });
        this.props.onShowImporting();
        try {
            const loadedFiles = await Promise.all(files.map(async file => ({
                name: file.name,
                data: await file.arrayBuffer()
            })));
            loadedFiles.forEach(file => {
                vm._projectZip.file(this.getUniqueAssetName(file.name), file.data);
            });
            vm.runtime.emitProjectChanged();
            this.setState({ selectedAssetIndex: this.getExtraAssets().length - 1 });
        } catch (error) {
            this.reportAssetError(error);
        } finally {
            event.target.value = '';
            this.props.onCloseImporting();
        }
    }

    setFileInput(input) {
        this.fileInput = input;
    }

    render() {
        const { intl, isRtl, vm } = this.props;
        if (!vm || !vm.editingTarget) return null;

        const assets = this.getExtraAssets();
        const selectedAsset = assets[this.state.selectedAssetIndex];

        return (
            <AssetPanel
                buttons={[
                    {
                        title: intl.formatMessage(messages.fileUploadAsset),
                        img: fileUploadIcon,
                        onClick: this.handleFileUploadClick
                    },
                    {
                        title: intl.formatMessage(messages.newTextFile),
                        img: addNewTxtFileIcon,
                        onClick: this.handleCreateBlankTextAsset
                    }
                ]}
                dragType={DragConstants.ASSET}
                isRtl={isRtl}
                items={assets.map(asset => ({
                    name: asset.name.substring('extraAssets/'.length),
                    dragPayload: asset,
                    details: '',
                    asset: null
                }))}
                vm={vm}
                selectedItemIndex={this.state.selectedAssetIndex}
                onDeleteClick={this.handleDeleteAsset}
                onDuplicateClick={this.handleDuplicateAsset}
                onExportClick={this.handleExportAsset}
                onItemClick={this.handleSelectAsset}
            >
                {this.state.uploadError && (
                    <p
                        role="alert"
                        style={{ padding: '12px' }}
                    >
                        {'Unable to import asset: '}{this.state.uploadError}
                    </p>
                )}
                {selectedAsset && (
                    <div
                        style={{
                            padding: '12px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    >
                        <h3 style={{ margin: '0 0 8px' }}>
                            {selectedAsset.name.substring('extraAssets/'.length)}
                        </h3>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '100px',
                                border: '1px solid rgba(0,0,0,0.15)',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.02)',
                                padding: '12px',
                                overflowWrap: 'anywhere'
                            }}
                        >
                            <span>
                                {formatSize((selectedAsset._data && selectedAsset._data.uncompressedSize) || 0)}
                            </span>
                        </div>
                    </div>
                )}
                <input
                    ref={this.setFileInput}
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={this.handleAssetUpload}
                />
            </AssetPanel>
        );
    }
}

AssetTab.propTypes = {
    intl: intlShape,
    isRtl: PropTypes.bool,
    onCloseImporting: PropTypes.func,
    onShowImporting: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    isRtl: state.locales.isRtl
});

const mapDispatchToProps = dispatch => ({
    onCloseImporting: () => dispatch(closeAlertWithId('importingAsset')),
    onShowImporting: () => dispatch(showStandardAlert('importingAsset'))
});

export default errorBoundaryHOC('Asset tab')(
    injectIntl(connect(mapStateToProps, mapDispatchToProps)(AssetTab))
);
