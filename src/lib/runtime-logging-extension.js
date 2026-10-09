class RuntimeLoggingExtension {
    constructor (runtime) {
        this.runtime = runtime;
    }
    getInfo () {
        return {
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
        };
    }
    log (args) {
        this.runtime.emit('RUNTIME_LOG', String(args.TEXT));
    }
    clearLogs () {
        this.runtime.emit('RUNTIME_LOGS_CLEAR');
    }
}

export default RuntimeLoggingExtension;
