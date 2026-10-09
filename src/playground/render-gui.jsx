import React from 'react';
import GUI from '../containers/gui.jsx';
import {normalizeBasePath} from '../lib/normalize-base-path';

const searchParams = new URLSearchParams(location.search);
const cloudHost = searchParams.get('cloud_host') || 'wss://clouddata.turbowarp.org';
const basePath = normalizeBasePath(process.env.ROOT);

const RenderGUI = props => (
    <GUI
        cloudHost={cloudHost}
        canSave={false}
        basePath={basePath}
        canEditTitle
        enableCommunity
        {...props}
    />
);

export default RenderGUI;
