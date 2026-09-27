import VM from 'scratch-vm';
import storage from '../lib/storage';
import {MAXIMUM_CLOUD_VARIABLES} from '../lib/tw-cloud-limits';

const SET_VM = 'scratch-gui/vm/SET_VM';
const registerSnailRuntimePrimitives = function (vm) {
    if (!vm || !vm.runtime || !vm.runtime._primitives) return;
    if (!vm.runtime._primitives.snailextras_wait) {
        vm.runtime._primitives.snailextras_wait = function (args) {
            const milliseconds = Number(args.TIME) || 0;
            return new Promise(resolve => {
                setTimeout(resolve, milliseconds);
            });
        };
    }
    if (!vm.runtime._primitives.snailextras_waitDivide) {
        vm.runtime._primitives.snailextras_waitDivide = function (args) {
            const seconds = Number(args.TIME) || 0;
            const divisor = Number(args.FUNNY) || 1;
            return new Promise(resolve => {
                setTimeout(resolve, (seconds * 1000) / divisor);
            });
        };
    }
    if (!vm.runtime._primitives.snailextras_fetch) {
        vm.runtime._primitives.snailextras_fetch = function (args) {
            return fetch(args.URL)
                .then(response => response.text())
                .catch(() => 'Uh oh! Something went wrong.');
        };
    }
};

const defaultVM = new VM();
defaultVM.setCompatibilityMode(true);
defaultVM.extensionManager.workerMode = 'iframe';
defaultVM.runtime.cloudOptions.limit = MAXIMUM_CLOUD_VARIABLES;
registerSnailRuntimePrimitives(defaultVM);
defaultVM.attachStorage(storage);
const initialState = defaultVM;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_VM:
        return action.vm;
    default:
        return state;
    }
};
const setVM = function (vm) {
    return {
        type: SET_VM,
        vm: vm
    };
};

export {
    reducer as default,
    initialState as vmInitialState,
    setVM
};
