import LazyScratchBlocks from './tw-lazy-scratch-blocks';
import localforage from 'localforage';
import flagButtonIcon from '../components/stage-header/stagecontrols/flag.png';
import pauseButtonIcon from '../components/stage-header/stagecontrols/pause.png';
import playButtonIcon from '../components/stage-header/stagecontrols/play.png';
import stopButtonIcon from '../components/stage-header/stagecontrols/stop.png';

/**
 * Connect scratch blocks with the vm
 * @param {VirtualMachine} vm - The scratch vm
 * @return {ScratchBlocks} ScratchBlocks connected with the vm
 */
export default function (vm) {
    const ScratchBlocks = LazyScratchBlocks.get();

    const jsonForMenuBlock = function (name, menuOptionsFn, colors, start) {
        return {
            message0: '%1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: name,
                    options: function () {
                        return start.concat(menuOptionsFn());
                    }
                }
            ],
            inputsInline: true,
            output: 'String',
            colour: colors.secondary,
            colourSecondary: colors.secondary,
            colourTertiary: colors.tertiary,
            outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND
        };
    };

    const jsonForHatBlockMenu = function (hatName, name, menuOptionsFn, colors, start) {
        const safeHatName = hatName || ScratchBlocks.Msg.CONTROL_STARTASCLONE || 'when I start as a clone';
        return {
            message0: safeHatName,
            args0: [
                {
                    type: 'field_dropdown',
                    name: name,
                    options: function () {
                        return start.concat(menuOptionsFn());
                    }
                }
            ],
            colour: colors.primary,
            colourSecondary: colors.secondary,
            colourTertiary: colors.tertiary,
            extensions: ['shape_hat']
        };
    };


    const jsonForSensingMenus = function (menuOptionsFn) {
        return {
            message0: ScratchBlocks.Msg.SENSING_OF,
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'PROPERTY',
                    options: function () {
                        return menuOptionsFn();
                    }

                },
                {
                    type: 'input_value',
                    name: 'OBJECT'
                }
            ],
            output: null,
            colour: ScratchBlocks.Colours.sensing.primary,
            colourSecondary: ScratchBlocks.Colours.sensing.secondary,
            colourTertiary: ScratchBlocks.Colours.sensing.tertiary,
            outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND
        };
    };

    const jsonForSensingSetMenus = function (menuOptionsFn) {
        return {
            message0: 'set %1 of %2 to %3',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'PROPERTY',
                    options: function () {
                        return menuOptionsFn();
                    }

                },
                {
                    type: 'input_value',
                    name: 'OBJECT'
                },
                {
                    type: 'input_value',
                    name: 'VALUE'
                }
            ],
            colour: ScratchBlocks.Colours.sensing.primary,
            colourSecondary: ScratchBlocks.Colours.sensing.secondary,
            colourTertiary: ScratchBlocks.Colours.sensing.tertiary,
            extensions: ['shape_statement']
        };
    };

    const soundsMenu = function () {
        let menu = [['', '']];
        if (vm.editingTarget && vm.editingTarget.sprite.sounds.length > 0) {
            menu = vm.editingTarget.sprite.sounds.map(sound => [sound.name, sound.name]);
        }
        menu.push([
            ScratchBlocks.ScratchMsgs.translate('SOUND_RECORD', 'record...'),
            ScratchBlocks.recordSoundCallback
        ]);
        return menu;
    };

    const costumesMenu = function () {
        const next = ScratchBlocks.ScratchMsgs.translate('LOOKS_NEXTCOSTUME', 'next costume');
        const previous = "previous costume" //ScratchBlocks.ScratchMsgs.translate('LOOKS_PREVIOUSCOSTUME', 'previous costume');
        // TODO: Add translation index into ScratchBlocks for this.

        const random = "random costume"//ScratchBlocks.ScratchMsgs.translate('LOOKS_RANDOMBACKDROP', 'random costume');
        // TODO: Add translation entry
        if (vm.editingTarget && vm.editingTarget.getCostumes().length > 0) {
            return vm.editingTarget.getCostumes().map(costume => [costume.name, costume.name])
                .concat([
                    [next, "next costume"],
                    [previous, "previous costume"],
                    [random, "random costume"]
                ])
            ;
        }
        return [['', '']];
    };

    const backdropsMenu = function () {
        const next = ScratchBlocks.ScratchMsgs.translate('LOOKS_NEXTBACKDROP', 'next backdrop');
        const previous = ScratchBlocks.ScratchMsgs.translate('LOOKS_PREVIOUSBACKDROP', 'previous backdrop');
        const random = ScratchBlocks.ScratchMsgs.translate('LOOKS_RANDOMBACKDROP', 'random backdrop');
        if (vm.runtime.targets[0] && vm.runtime.targets[0].getCostumes().length > 0) {
            return vm.runtime.targets[0].getCostumes().map(costume => [costume.name, costume.name])
                .concat([[next, 'next backdrop'],
                    [previous, 'previous backdrop'],
                    [random, 'random backdrop']]);
        }
        return [['', '']];
    };

    const backdropNamesMenu = function () {
        const stage = vm.runtime.getTargetForStage();
        if (stage && stage.getCostumes().length > 0) {
            return stage.getCostumes().map(costume => [costume.name, costume.name]);
        }
        return [['', '']];
    };

    const spriteMenu = function () {
        const sprites = [];
        for (const targetId in vm.runtime.targets) {
            if (!vm.runtime.targets.hasOwnProperty(targetId)) continue;
            if (vm.runtime.targets[targetId].isOriginal) {
                if (!vm.runtime.targets[targetId].isStage) {
                    if (vm.runtime.targets[targetId] === vm.editingTarget) {
                        continue;
                    }
                    sprites.push([vm.runtime.targets[targetId].sprite.name, vm.runtime.targets[targetId].sprite.name]);
                }
            }
        }
        return sprites;
    };

    const cloneMenu = function () {
        if (vm.editingTarget && vm.editingTarget.isStage) {
            const menu = spriteMenu();
            if (menu.length === 0) {
                return [['', '']]; // Empty menu matches Scratch 2 behavior
            }
            return menu;
        }
        const myself = ScratchBlocks.ScratchMsgs.translate('CONTROL_CREATECLONEOF_MYSELF', 'myself');
        return [[myself, '_myself_']].concat(spriteMenu());
    };

    const soundColors = ScratchBlocks.Colours.sounds;

    const looksColors = ScratchBlocks.Colours.looks;

    const motionColors = ScratchBlocks.Colours.motion;

    const sensingColors = ScratchBlocks.Colours.sensing;

    const controlColors = ScratchBlocks.Colours.control;

    const eventColors = ScratchBlocks.Colours.event;

    const registerButtonHat = (opcode, icon, alt, colors) => {
        ScratchBlocks.Blocks[opcode] = {
            init: function () {
                this.jsonInit({
                    message0: 'when %1 clicked',
                    args0: [{
                        type: 'field_image',
                        src: icon,
                        width: 20,
                        height: 20,
                        alt
                    }],
                    nextStatement: null,
                    colour: colors.primary,
                    colourSecondary: colors.secondary,
                    colourTertiary: colors.tertiary,
                    extensions: ['shape_hat']
                });
            }
        };

        if (vm.runtime && vm.runtime._hats && !vm.runtime._hats[opcode]) {
            vm.runtime._hats[opcode] = {restartExistingThreads: true};
        }
    };

    registerButtonHat('event_whenflagclicked', flagButtonIcon, 'Flag', eventColors);
    registerButtonHat('event_whenstopclicked', stopButtonIcon, 'Stop', eventColors);
    registerButtonHat('event_whenpausebuttonclicked', pauseButtonIcon, 'Pause', eventColors);
    registerButtonHat('event_whenplaybuttonclicked', playButtonIcon, 'Play', eventColors);

    ScratchBlocks.Blocks.control_backToGreenFlag.init = function () {
        this.jsonInit({
            inputsInline: true,
            message0: 'run %1',
            args0: [{
                type: 'field_image',
                src: flagButtonIcon,
                width: 24,
                height: 24,
                alt: 'Flag',
                flip_rtl: false
            }],
            category: ScratchBlocks.Categories.control,
            extensions: ['colours_control', 'shape_statement']
        });
    };

    const registerCustomBlock = (opcode, json) => {
        ScratchBlocks.Blocks[opcode] = {
            init: function () {
                this.jsonInit(json);
            }
        };
    };

    const registerControlButtonBlock = (opcode, label, icon, alt) => {
        registerCustomBlock(opcode, {
            message0: `${label} %1`,
            args0: [{
                type: 'field_image',
                src: icon,
                width: 20,
                height: 20,
                alt
            }],
            previousStatement: null,
            nextStatement: null,
            colour: controlColors.primary,
            colourSecondary: controlColors.secondary,
            colourTertiary: controlColors.tertiary,
            extensions: ['shape_statement']
        });
    };

    registerControlButtonBlock('control_pause', 'pause', pauseButtonIcon, 'Pause');
    registerControlButtonBlock('control_resume', 'resume', playButtonIcon, 'Resume');

    registerCustomBlock('looks_tutorialmod_alert', {
        message0: 'show alert %1',
        args0: [{type: 'input_value', name: 'MESSAGE'}],
        previousStatement: null,
        nextStatement: null,
        colour: looksColors.primary,
        colourSecondary: looksColors.secondary,
        colourTertiary: looksColors.tertiary,
        extensions: ['shape_statement']
    });
    registerCustomBlock('sensing_savedata', {
        message0: 'save data %1 as %2 locally',
        args0: [
            {type: 'input_value', name: 'VALUE'},
            {type: 'input_value', name: 'NAME'}
        ],
        previousStatement: null,
        nextStatement: null,
        colour: sensingColors.primary,
        colourSecondary: sensingColors.secondary,
        colourTertiary: sensingColors.tertiary,
        extensions: ['shape_statement']
    });
    registerCustomBlock('sensing_getdata', {
        message0: 'get local data from %1',
        args0: [{type: 'input_value', name: 'NAME'}],
        output: 'String',
        outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND,
        colour: sensingColors.primary,
        colourSecondary: sensingColors.secondary,
        colourTertiary: sensingColors.tertiary
    });
    registerCustomBlock('sensing_unix', {
        message0: 'unix timestamp',
        output: 'Number',
        outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND,
        colour: sensingColors.primary,
        colourSecondary: sensingColors.secondary,
        colourTertiary: sensingColors.tertiary
    });
    registerCustomBlock('sensing_question', {
        message0: 'question',
        output: 'String',
        outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND,
        checkboxInFlyout: true,
        colour: sensingColors.primary,
        colourSecondary: sensingColors.secondary,
        colourTertiary: sensingColors.tertiary
    });

    if (vm.runtime && vm.runtime._primitives) {
        const startControlButtonHat = opcode => {
            if (!vm.runtime._hats[opcode]) {
                vm.runtime._hats[opcode] = {restartExistingThreads: true};
            }
            return vm.runtime.startHats(opcode) || [];
        };

        vm.runtime._primitives.control_pause = () => {
            vm.pause();
            const pauseHatThreads = startControlButtonHat('event_whenpausebuttonclicked');
            pauseHatThreads.forEach(thread => thread.play());
        };
        vm.runtime._primitives.control_resume = () => {
            vm.play();
            startControlButtonHat('event_whenplaybuttonclicked');
        };

        vm.runtime._primitives.looks_tutorialmod_alert = async args => window.alert(args.MESSAGE);
        vm.runtime._primitives.sensing_savedata = async args => {
            const key = `si_ugc_${String(args.NAME)}`;
            if (args.VALUE === '') return localforage.removeItem(key);
            return localforage.setItem(key, args.VALUE);
        };
        vm.runtime._primitives.sensing_getdata = async args => {
            const value = await localforage.getItem(`si_ugc_${String(args.NAME)}`);
            return value ?? '';
        };
        vm.runtime._primitives.sensing_unix = () => Math.floor(Date.now() / 1000);

        if (!vm.runtime._permafySensingQuestionRegistered) {
            const askAndWait = vm.runtime._primitives.sensing_askandwait;
            vm.runtime._lastQuestion = '';
            vm.runtime._primitives.sensing_askandwait = function (args, util) {
                vm.runtime._lastQuestion = String(args.QUESTION);
                return askAndWait.call(this, args, util);
            };
            vm.runtime._primitives.sensing_question = () => vm.runtime._lastQuestion;
            vm.runtime.on('PROJECT_START', () => {
                vm.runtime._lastQuestion = '';
            });
            vm.runtime._permafySensingQuestionRegistered = true;
        }

        const clipboardState = {value: '', lastRead: 0};
        vm.runtime._primitives.sensing_setclipboard = async args => {
            clipboardState.value = String(args.ITEM);
            const clipboard = typeof navigator === 'undefined' ? null : navigator.clipboard;
            if (!clipboard || typeof clipboard.writeText !== 'function') return;
            try {
                await clipboard.writeText(clipboardState.value);
            } catch (error) {
                return;
            }
        };
        vm.runtime._primitives.sensing_getclipboard = async () => {
            const clipboard = typeof navigator === 'undefined' ? null : navigator.clipboard;
            if (!clipboard || typeof clipboard.readText !== 'function') return clipboardState.value;
            if (Date.now() - clipboardState.lastRead < 250) return clipboardState.value;
            clipboardState.lastRead = Date.now();
            try {
                clipboardState.value = await clipboard.readText();
            } catch (error) {
                return clipboardState.value;
            }
            return clipboardState.value;
        };
    }

    ScratchBlocks.Blocks.sound_sounds_menu.init = function () {
        const json = jsonForMenuBlock('SOUND_MENU', soundsMenu, soundColors, []);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.looks_costume.init = function () {
        const json = jsonForMenuBlock('COSTUME', costumesMenu, looksColors, []);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.looks_backdrops.init = function () {
        const json = jsonForMenuBlock('BACKDROP', backdropsMenu, looksColors, []);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.event_whenbackdropswitchesto.init = function () {
        const json = jsonForHatBlockMenu(
            ScratchBlocks.Msg.EVENT_WHENBACKDROPSWITCHESTO,
            'BACKDROP', backdropNamesMenu, eventColors, []);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.motion_pointtowards_menu.init = function () {
        const random = ScratchBlocks.ScratchMsgs.translate('MOTION_POINTTOWARDS_RANDOM', 'random direction');
        const mouse = ScratchBlocks.ScratchMsgs.translate('MOTION_POINTTOWARDS_POINTER', 'mouse-pointer');
        const json = jsonForMenuBlock('TOWARDS', spriteMenu, motionColors, [
            [mouse, '_mouse_'],
            [random, '_random_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.motion_goto_menu.init = function () {
        const random = ScratchBlocks.ScratchMsgs.translate('MOTION_GOTO_RANDOM', 'random position');
        const mouse = ScratchBlocks.ScratchMsgs.translate('MOTION_GOTO_POINTER', 'mouse-pointer');
        const json = jsonForMenuBlock('TO', spriteMenu, motionColors, [
            [random, '_random_'],
            [mouse, '_mouse_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.motion_glideto_menu.init = function () {
        const random = ScratchBlocks.ScratchMsgs.translate('MOTION_GLIDETO_RANDOM', 'random position');
        const mouse = ScratchBlocks.ScratchMsgs.translate('MOTION_GLIDETO_POINTER', 'mouse-pointer');
        const json = jsonForMenuBlock('TO', spriteMenu, motionColors, [
            [random, '_random_'],
            [mouse, '_mouse_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_of_object_menu.init = function () {
        const stage = ScratchBlocks.ScratchMsgs.translate('SENSING_OF_STAGE', 'Stage');
        const json = jsonForMenuBlock('OBJECT', spriteMenu, sensingColors, [
            [stage, '_stage_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_of.init = function () {
        const blockId = this.id;
        const blockType = this.type;

        // Get the sensing_of block from vm.
        let defaultSensingOfBlock;
        const blocks = vm.runtime.flyoutBlocks._blocks;
        Object.keys(blocks).forEach(id => {
            const block = blocks[id];
            if (id === blockType || (block && block.opcode === blockType)) {
                defaultSensingOfBlock = block;
            }
        });

        // Function that fills in menu for the first input in the sensing block.
        // Called every time it opens since it depends on the values in the other block input.
        const menuFn = function () {
            const stageOptions = [
                [ScratchBlocks.Msg.SENSING_OF_BACKDROPNUMBER, 'backdrop #'],
                [ScratchBlocks.Msg.SENSING_OF_BACKDROPNAME, 'backdrop name'],
                [ScratchBlocks.Msg.SENSING_OF_VOLUME, 'volume']
            ];
            const spriteOptions = [
                [ScratchBlocks.Msg.SENSING_OF_XPOSITION, 'x position'],
                [ScratchBlocks.Msg.SENSING_OF_YPOSITION, 'y position'],
                [ScratchBlocks.Msg.SENSING_OF_DIRECTION, 'direction'],
                [ScratchBlocks.Msg.SENSING_OF_COSTUMENUMBER, 'costume #'],
                [ScratchBlocks.Msg.SENSING_OF_COSTUMENAME, 'costume name'],
                ['layer', 'layer'],
                [ScratchBlocks.Msg.SENSING_OF_SIZE, 'size'],
                [ScratchBlocks.Msg.SENSING_OF_VOLUME, 'volume']
            ];
            if (vm.editingTarget) {
                let lookupBlocks = vm.editingTarget.blocks;
                let sensingOfBlock = lookupBlocks.getBlock(blockId);

                // The block doesn't exist, but should be in the flyout. Look there.
                if (!sensingOfBlock) {
                    sensingOfBlock = vm.runtime.flyoutBlocks.getBlock(blockId) || defaultSensingOfBlock;
                    // If we still don't have a block, just return an empty list . This happens during
                    // scratch blocks construction.
                    if (!sensingOfBlock) {
                        return [['', '']];
                    }
                    // The block was in the flyout so look up future block info there.
                    lookupBlocks = vm.runtime.flyoutBlocks;
                }
                const sort = function (options) {
                    options.sort(ScratchBlocks.scratchBlocksUtils.compareStrings);
                };
                // Get all the stage variables (no lists) so we can add them to menu when the stage is selected.
                const stageVariableOptions = vm.runtime.getTargetForStage().getAllVariableNamesInScopeByType('');
                sort(stageVariableOptions);
                const stageVariableMenuItems = stageVariableOptions.map(variable => [variable, variable]);
                if (sensingOfBlock.inputs.OBJECT.shadow !== sensingOfBlock.inputs.OBJECT.block) {
                    // There's a block dropped on top of the menu. It'd be nice to evaluate it and
                    // return the correct list, but that is tricky. Scratch2 just returns stage options
                    // so just do that here too.
                    return stageOptions.concat(stageVariableMenuItems);
                }
                const menuBlock = lookupBlocks.getBlock(sensingOfBlock.inputs.OBJECT.shadow);
                const selectedItem = menuBlock.fields.OBJECT.value;
                if (selectedItem === '_stage_') {
                    return stageOptions.concat(stageVariableMenuItems);
                }
                // Get all the local variables (no lists) and add them to the menu.
                const target = vm.runtime.getSpriteTargetByName(selectedItem);
                let spriteVariableOptions = [];
                // The target should exist, but there are ways for it not to (e.g. #4203).
                if (target) {
                    spriteVariableOptions = target.getAllVariableNamesInScopeByType('', true);
                    sort(spriteVariableOptions);
                }
                const spriteVariableMenuItems = spriteVariableOptions.map(variable => [variable, variable]);
                return spriteOptions.concat(spriteVariableMenuItems);
            }
            return [['', '']];
        };

        const json = jsonForSensingMenus(menuFn);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_set_of.init = function () {
        const blockId = this.id;
        const blockType = this.type;

        // Get the sensing_of block from vm.
        let defaultSensingOfBlock;
        const blocks = vm.runtime.flyoutBlocks._blocks;
        Object.keys(blocks).forEach(id => {
            const block = blocks[id];
            if (id === blockType || (block && block.opcode === blockType)) {
                defaultSensingOfBlock = block;
            }
        });

        // Function that fills in menu for the first input in the sensing block.
        // Called every time it opens since it depends on the values in the other block input.
        const menuFn = function () {
            const stageOptions = [
                ['backdrop', 'backdrop'],
                [ScratchBlocks.Msg.SENSING_OF_VOLUME, 'volume']
            ];
            const spriteOptions = [
                [ScratchBlocks.Msg.SENSING_OF_XPOSITION, 'x position'],
                [ScratchBlocks.Msg.SENSING_OF_YPOSITION, 'y position'],
                [ScratchBlocks.Msg.SENSING_OF_DIRECTION, 'direction'],
                ['costume', 'costume'],
                [ScratchBlocks.Msg.SENSING_OF_SIZE, 'size'],
                [ScratchBlocks.Msg.SENSING_OF_VOLUME, 'volume']
            ];
            if (vm.editingTarget) {
                let lookupBlocks = vm.editingTarget.blocks;
                let sensingOfBlock = lookupBlocks.getBlock(blockId);

                // The block doesn't exist, but should be in the flyout. Look there.
                if (!sensingOfBlock) {
                    sensingOfBlock = vm.runtime.flyoutBlocks.getBlock(blockId) || defaultSensingOfBlock;
                    // If we still don't have a block, just return an empty list . This happens during
                    // scratch blocks construction.
                    if (!sensingOfBlock) {
                        return [['', '']];
                    }
                    // The block was in the flyout so look up future block info there.
                    lookupBlocks = vm.runtime.flyoutBlocks;
                }
                const sort = function (options) {
                    options.sort(ScratchBlocks.scratchBlocksUtils.compareStrings);
                };
                // Get all the stage variables (no lists) so we can add them to menu when the stage is selected.
                const stageVariableOptions = vm.runtime.getTargetForStage().getAllVariableNamesInScopeByType('');
                sort(stageVariableOptions);
                const stageVariableMenuItems = stageVariableOptions.map(variable => [variable, variable]);
                if (sensingOfBlock.inputs.OBJECT.shadow !== sensingOfBlock.inputs.OBJECT.block) {
                    // There's a block dropped on top of the menu. It'd be nice to evaluate it and
                    // return the correct list, but that is tricky. Scratch2 just returns stage options
                    // so just do that here too.
                    return stageOptions.concat(stageVariableMenuItems);
                }
                const menuBlock = lookupBlocks.getBlock(sensingOfBlock.inputs.OBJECT.shadow);
                const selectedItem = menuBlock.fields.OBJECT.value;
                if (selectedItem === '_stage_') {
                    return stageOptions.concat(stageVariableMenuItems);
                }
                // Get all the local variables (no lists) and add them to the menu.
                const target = vm.runtime.getSpriteTargetByName(selectedItem);
                let spriteVariableOptions = [];
                // The target should exist, but there are ways for it not to (e.g. #4203).
                if (target) {
                    spriteVariableOptions = target.getAllVariableNamesInScopeByType('', true);
                    sort(spriteVariableOptions);
                }
                const spriteVariableMenuItems = spriteVariableOptions.map(variable => [variable, variable]);
                return spriteOptions.concat(spriteVariableMenuItems);
            }
            return [['', '']];
        };

        const json = jsonForSensingSetMenus(menuFn);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_distancetomenu.init = function () {
        const mouse = ScratchBlocks.ScratchMsgs.translate('SENSING_DISTANCETO_POINTER', 'mouse-pointer');
        const json = jsonForMenuBlock('DISTANCETOMENU', spriteMenu, sensingColors, [
            [mouse, '_mouse_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_touchingobjectmenu.init = function () {
        const mouse = ScratchBlocks.ScratchMsgs.translate('SENSING_TOUCHINGOBJECT_POINTER', 'mouse-pointer');
        const edge = ScratchBlocks.ScratchMsgs.translate('SENSING_TOUCHINGOBJECT_EDGE', 'edge');
        const json = jsonForMenuBlock('TOUCHINGOBJECTMENU', spriteMenu, sensingColors, [
            [mouse, '_mouse_'],
            [edge, '_edge_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_fulltouchingobjectmenu.init = function () {
        const mouse = ScratchBlocks.ScratchMsgs.translate('SENSING_TOUCHINGOBJECT_POINTER', 'mouse-pointer');
        const edge = ScratchBlocks.ScratchMsgs.translate('SENSING_TOUCHINGOBJECT_EDGE', 'edge');
        const json = jsonForMenuBlock('FULLTOUCHINGOBJECTMENU', spriteMenu, sensingColors, [
            [mouse, '_mouse_'],
            [edge, '_edge_'],
            ['this sprite', '_myself_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_touchingobjectmenusprites.init = function () {
        const json = jsonForMenuBlock('SPRITETOUCHINGOBJECTMENU', spriteMenu, sensingColors, [
            ['this sprite', '_myself_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.control_create_clone_of_menu.init = function () {
        const json = jsonForMenuBlock('CLONE_OPTION', cloneMenu, controlColors, []);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.control_run_as_sprite_menu.init = function () {
        const json = jsonForMenuBlock('RUN_AS_OPTION', spriteMenu, controlColors, [
            ['Stage', '_stage_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.control_stop_sprite_menu.init = function () {
        const json = jsonForMenuBlock('STOP_OPTION', spriteMenu, controlColors, [
            ['Stage', '_stage_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.looks_getOtherSpriteVisible_menu.init = function () {
        const json = jsonForMenuBlock('VISIBLE_OPTION', spriteMenu, looksColors, [
            ['this sprite', '_myself_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.looks_changeVisibilityOfSprite_menu.init = function () {
        const json = jsonForMenuBlock('VISIBLE_OPTION', spriteMenu, looksColors, [
            ['this sprite', '_myself_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.VerticalFlyout.getCheckboxState = function (blockId, inputList) {
        const monitoredBlock = vm.runtime.monitorBlocks._blocks[blockId];
        if (!monitoredBlock)
            return false;

        const { opcode, fields } = monitoredBlock;

        if (opcode == "data_variable" || opcode == "data_listcontents")
            return monitoredBlock ? monitoredBlock.isMonitored : false;

        const parsedFields = inputList[0].fieldRow
            .filter(({ name }) => name in fields)
            .map(field => {
                if (field.variable_) return field.variable_.name;
                return field.name === "CURRENTMENU" ? field.value_.toLowerCase() : field.value_;
            }).join("_");

        const newBlockId = blockId + (parsedFields.length ? "_" : "") + parsedFields;

        const newMonitoredBlock = vm.runtime.monitorBlocks._blocks[newBlockId];

        return newMonitoredBlock ? newMonitoredBlock.isMonitored : false;
    };

    ScratchBlocks.FlyoutExtensionCategoryHeader.getExtensionState = function (extensionId) {
        if (vm.getPeripheralIsConnected(extensionId)) {
            return ScratchBlocks.StatusButtonState.READY;
        }
        return ScratchBlocks.StatusButtonState.NOT_READY;
    };

    ScratchBlocks.FieldNote.playNote_ = function (noteNum, extensionId) {
        vm.runtime.emit('PLAY_NOTE', noteNum, extensionId);
    };

    // Use a collator's compare instead of localeCompare which internally
    // creates a collator. Using this is a lot faster in browsers that create a
    // collator for every localeCompare call.
    const collator = new Intl.Collator([], {
        sensitivity: 'base',
        numeric: true
    });
    ScratchBlocks.scratchBlocksUtils.compareStrings = function (str1, str2) {
        return collator.compare(str1, str2);
    };

    // Blocks wants to know if 3D CSS transforms are supported. The cross
    // section of browsers Scratch supports and browsers that support 3D CSS
    // transforms will make the return always true.
    //
    // Shortcutting to true lets us skip an expensive style recalculation when
    // first loading the Scratch editor.
    ScratchBlocks.utils.is3dSupported = function () {
        return true;
    };

    // brute force a toolbox update if there are no extensions loaded
    // Someone made a commit that broke initial toolbox populate calls back in the day
    // and no one can find it, this brute fixes the problem...
    vm.runtime.on("PROJECT_LOADED", () => {
        if (vm.extensionManager._loadedExtensions.size > 0) return;

        const workspace = ScratchBlocks.getMainWorkspace();
        const toolbox = workspace.getToolbox();
        if (!toolbox) return;
        const categoryMenu = toolbox.categoryMenu_;
        if (!categoryMenu) return;
        if (categoryMenu.secondTable) return;

        categoryMenu.dispose();
        categoryMenu.createDom();
        toolbox.populate_(workspace.options.languageTree);
        toolbox.position();
    });

    return ScratchBlocks;
}
