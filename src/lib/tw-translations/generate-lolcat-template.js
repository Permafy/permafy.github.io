/* eslint-disable import/no-commonjs */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../../');
const extractedMessages = path.join(root, 'translations/messages/src');
const templatePath = path.join(__dirname, 'lolcat.json');
const editorMessagesPath = require.resolve('@turbowarp/scratch-l10n/locales/editor-msgs');
const editorMessages = JSON.parse(fs.readFileSync(editorMessagesPath, 'utf8').slice(34, -2));
const template = Object.assign({}, editorMessages.en);

const addExtractedMessages = directory => {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            addExtractedMessages(entryPath);
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
            const messages = JSON.parse(fs.readFileSync(entryPath, 'utf8'));
            for (const message of messages) {
                if (message.id && typeof message.defaultMessage === 'string') {
                    template[message.id] = template[message.id] || message.defaultMessage;
                }
            }
        }
    }
};

addExtractedMessages(extractedMessages);

if (fs.existsSync(templatePath)) {
    const existingTranslations = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    Object.assign(template, existingTranslations);
}

fs.writeFileSync(templatePath, `${JSON.stringify(template, null, 2)}\n`);
console.log(`Updated ${templatePath} with ${Object.keys(template).length} message labels.`);
