import scratchAddonsSettings from './scratch-addons-settings.json';
import SettingsStore from '../../settings-store-singleton';

/** Apply the Scratch Addons settings export as the complete Permafy addon configuration. */
export default function applyScratch2Preset () {
    SettingsStore.resetAllAddons();
    SettingsStore.import(scratchAddonsSettings);
}
