// run with
// node scripts/translation-from-sheet.js "(en)" src/lib/resources/localization/translation/language/en.json

import { GOOGLE_SHEETS_KEY } from "./sheet-token.js";

// replace with your api key, if your a pm dev than just ask gsa for a key
const KEY = GOOGLE_SHEETS_KEY;
import fs from 'fs/promises'

// TODO: UNIMPORTANT: We might need a generic or at least diff version of this to grab things like translated LoadingTips in separate sheets from the big important one?
// get the index sheet for what all pages exist
fetch(`https://sheets.googleapis.com/v4/spreadsheets/114K0H8ZbAA5r0APKLbybgHDcEVmsrQP5HRwKT589A9c?key=${KEY}`)
    .then(req => req.json())
    .then(async spreadSheet => {
        // final arg will be treated as the path to save as
        const search = process.argv.slice(2, -1)
            .join(' ')
            .split(/[^a-z\(\)]+/gi)
            .map(key => key.toLowerCase());
        const possible = spreadSheet.sheets
            .map(sheet => ({
                name: sheet.properties.title,
                id: sheet.properties.sheetId,
                length: sheet.properties.title.split(/[^a-z\(\)]+/gi).filter(key => search.includes(key.toLowerCase())).length,
                width: 3,
                height: sheet.properties.gridProperties.rowCount
            }))
            .filter(sheet => sheet.length > 0)
            .sort((a,b) => b.length - a.length);
        console.log('Matched', possible.map(sheet => sheet.name).join(', '));

        const sheet = possible[0];
        const req = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/114K0H8ZbAA5r0APKLbybgHDcEVmsrQP5HRwKT589A9c/values/${sheet.name}!A1:B${sheet.height}?key=${KEY}`);
        const cells = await req.json();
        cells.values.shift();

        const pullDate = `${new Date(Date.now()).toLocaleString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZoneName: "long",
        })}`;
        const langObject = Object.fromEntries(cells.values);
        // NOTE: These are intended for maintenance rather than use in PM
        langObject["---_SHEET_TITLE"] = String(sheet.name);
        langObject["---_PULL_TIMESTAMP"] = String(Date.now());
        langObject["---_PULL_DATE"] = String(pullDate);

        const langDef = JSON.stringify(langObject, null, 4);
        fs.writeFile(process.argv.at(-1) || 'en.json', `${langDef}`);
    });
