// Icon paths adapted from scratchblocks (MIT; see adjacent license); artwork is from Scratch Blocks.
/* eslint-disable max-len */
import greenFlag from '!base64-loader!../components/stage-header/stagecontrols/flag.png';
import pause from '!base64-loader!../components/stage-header/stagecontrols/pause.png';
import play from '!base64-loader!../components/stage-header/stagecontrols/play.png';
import stopSign from '!base64-loader!../components/stage-header/stagecontrols/stop.png';

const icons = {
    greenFlag: {
        command: '@flag',
        aliases: ['@greenflag'],
        image: `data:image/png;base64,${greenFlag}`
    },
    pause: {
        command: '@pause',
        image: `data:image/png;base64,${pause}`
    },
    play: {
        command: '@play',
        image: `data:image/png;base64,${play}`
    },
    stopSign: {
        command: '@stop',
        aliases: ['@stopsign'],
        image: `data:image/png;base64,${stopSign}`
    },
    turnLeft: {
        command: '@turnleft',
        viewBox: '0 0 24 24',
        svg: '<path fill="#3d79cc" d="M20.34 18.21a10.24 10.24 0 0 1-8.1 4.22 2.26 2.26 0 0 1-.16-4.52 5.58 5.58 0 0 0 4.25-2.53 5.06 5.06 0 0 0 .54-4.62A4.25 4.25 0 0 0 15.55 9a4.31 4.31 0 0 0-2-.8 4.82 4.82 0 0 0-3.15.8l1.12 1.41A1.59 1.59 0 0 1 10.36 13H2.67a1.56 1.56 0 0 1-1.26-.63A1.54 1.54 0 0 1 1.13 11l1.72-7.43A1.59 1.59 0 0 1 4.38 2.4a1.57 1.57 0 0 1 1.24.6L6.7 4.35a10.66 10.66 0 0 1 7.72-1.68A9.88 9.88 0 0 1 19 4.81 9.61 9.61 0 0 1 21.83 9a10.08 10.08 0 0 1-1.49 9.21z"/><path fill="#fff" d="M19.56 17.65a9.29 9.29 0 0 1-7.35 3.83 1.31 1.31 0 0 1-.08-2.62 6.53 6.53 0 0 0 5-2.92 6.05 6.05 0 0 0 .67-5.51 5.32 5.32 0 0 0-1.64-2.16 5.21 5.21 0 0 0-2.48-1A5.86 5.86 0 0 0 9 8.84L10.74 11a.59.59 0 0 1-.43 1H2.7a.6.6 0 0 1-.6-.75l1.71-7.42a.59.59 0 0 1 1-.21l1.67 2.1a9.71 9.71 0 0 1 7.75-2.07 8.84 8.84 0 0 1 4.12 1.92 8.68 8.68 0 0 1 2.54 3.72 9.14 9.14 0 0 1-1.33 8.36z"/>'
    },
    turnRight: {
        command: '@turnright',
        viewBox: '0 0 24 24',
        svg: '<path fill="#3d79cc" d="M22.68 12.2a1.6 1.6 0 0 1-1.27.63h-7.69a1.59 1.59 0 0 1-1.16-2.58l1.12-1.41a4.82 4.82 0 0 0-3.14-.77 4.31 4.31 0 0 0-2 .8A4.25 4.25 0 0 0 7.2 10.6a5.06 5.06 0 0 0 .54 4.62A5.58 5.58 0 0 0 12 17.74a2.26 2.26 0 0 1-.16 4.52A10.25 10.25 0 0 1 3.74 18a10.14 10.14 0 0 1-1.49-9.22 9.7 9.7 0 0 1 2.83-4.14A9.92 9.92 0 0 1 9.66 2.5a10.66 10.66 0 0 1 7.72 1.68l1.08-1.35a1.57 1.57 0 0 1 1.24-.6 1.6 1.6 0 0 1 1.54 1.21l1.7 7.37a1.57 1.57 0 0 1-.26 1.39z"/><path fill="#fff" d="M21.38 11.83h-7.61a.59.59 0 0 1-.43-1l1.75-2.19a5.9 5.9 0 0 0-4.7-1.58 5.07 5.07 0 0 0-4.11 3.17A6 6 0 0 0 7 15.77a6.51 6.51 0 0 0 5 2.92 1.31 1.31 0 0 1-.08 2.62 9.3 9.3 0 0 1-7.35-3.82 9.16 9.16 0 0 1-1.4-8.37A8.51 8.51 0 0 1 5.71 5.4a8.76 8.76 0 0 1 4.11-1.92 9.71 9.71 0 0 1 7.75 2.07l1.67-2.1a.59.59 0 0 1 1 .21L22 11.08a.59.59 0 0 1-.62.75z"/>'
    },
    loopArrow: {
        command: '@loop',
        aliases: ['@looparrow'],
        viewBox: '0 0 24 24',
        svg: '<path fill="#cf8b17" d="M23.3 11c-.3.6-.9 1-1.5 1h-1.6c-.1 1.3-.5 2.5-1.1 3.6-.9 1.7-2.3 3.2-4.1 4.1-1.7.9-3.6 1.2-5.5.9-1.8-.3-3.5-1.1-4.9-2.3-.7-.7-.7-1.9 0-2.6.6-.6 1.6-.7 2.3-.2H7c.9.6 1.9.9 2.9.9s1.9-.3 2.7-.9c1.1-.8 1.8-2.1 1.8-3.5h-1.5c-.9 0-1.7-.7-1.7-1.7 0-.4.2-.9.5-1.2l4.4-4.4c.7-.6 1.7-.6 2.4 0L23 9.2c.5.5.6 1.2.3 1.8z"/><path fill="#fff" d="M21.8 11h-2.6c0 1.5-.3 2.9-1 4.2-.8 1.6-2.1 2.8-3.7 3.6-1.5.8-3.3 1.1-4.9.8-1.6-.2-3.2-1-4.4-2.1-.4-.3-.4-.9-.1-1.2.3-.4.9-.4 1.2-.1l0 0c1 .7 2.2 1.1 3.4 1.1s2.3-.3 3.3-1c.9-.6 1.6-1.5 2-2.6.3-.9.4-1.8.2-2.8h-2.4c-.4 0-.7-.3-.7-.7 0-.2.1-.3.2-.4l4.4-4.4c.3-.3.7-.3.9 0L22 9.8c.3.3.4.6.3.9s-.3.3-.5.3z"/>'
    },
    list: {
        command: '@list',
        viewBox: '0 0 15 18',
        svg: '<rect x="0" y="0" width="15" height="18" fill="#fff"/><rect x="1" y="1" width="13" height="4" fill="#ff920f"/><rect x="1" y="7" width="13" height="4" fill="#ff920f"/><rect x="1" y="13" width="13" height="4" fill="#ff920f"/>'
    }
};

const getImage = icon => {
    if (icon.image) return icon.image;
    const image = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="${icon.viewBox}">${icon.svg}</svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(image)}`;
};

const iconList = Object.keys(icons).map(name => ({
    name,
    command: icons[name].command,
    image: getImage(icons[name])
}));

const commandToImage = Object.keys(icons).reduce((result, name) => {
    const icon = icons[name];
    [icon.command, ...(icon.aliases || [])].forEach(command => {
        result[command] = getImage(icon);
    });
    return result;
}, {});

const imageToCommand = iconList.reduce((result, icon) => {
    result[icon.image] = icon.command;
    return result;
}, {});

export const getIconImage = command => {
    if (typeof command !== 'string' || !command) return null;
    const normalizedCommand = command.toLowerCase();
    return Object.prototype.hasOwnProperty.call(commandToImage, normalizedCommand) ?
        commandToImage[normalizedCommand] :
        null;
};
export const getIconCommand = image => imageToCommand[image] || '';
export default () => iconList;
