import RuntimeLoggingExtension from '../../../src/lib/runtime-logging-extension';

describe('Runtime logging extension', () => {
    test('defines a non-reporter log block in a blue Debug category', () => {
        const extension = new RuntimeLoggingExtension({emit: jest.fn()});

        expect(extension.getInfo()).toEqual({
            id: 'debug',
            name: 'Debug',
            color1: '#2f689e',
            color2: '#2f689e',
            color3: '#2f689e',
            blocks: [
                {
                    opcode: 'log',
                    text: 'log [TEXT]',
                    blockType: 'command',
                    arguments: {
                        TEXT: {
                            type: 'string',
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'clearLogs',
                    text: 'clear logs',
                    blockType: 'command'
                }
            ]
        });
    });

    test('emits the logged text for the Logs panel', () => {
        const runtime = {emit: jest.fn()};
        const extension = new RuntimeLoggingExtension(runtime);

        extension.log({TEXT: 'Hello!'});

        expect(runtime.emit).toHaveBeenCalledWith('RUNTIME_LOG', 'Hello!');
    });

    test('clears the Logs panel', () => {
        const runtime = {emit: jest.fn()};
        const extension = new RuntimeLoggingExtension(runtime);

        extension.clearLogs();

        expect(runtime.emit).toHaveBeenCalledWith('RUNTIME_LOGS_CLEAR');
    });
});
