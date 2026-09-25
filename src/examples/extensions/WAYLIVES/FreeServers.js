class FreeServersExtension {
    getInfo () {
        return {
            id: 'waylivesFreeServers',
            name: 'Free Servers',
            blocks: [
                {
                    opcode: 'freeServerName',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'free server name [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'example-server'
                        }
                    },
                    func: 'freeServerName'
                }
            ]
        };
    }

    freeServerName (args) {
        return `Free server: ${args.NAME}`;
    }
}

Scratch.extensions.register(new FreeServersExtension());
