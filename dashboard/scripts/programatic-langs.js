// run with
// npm run indexl10n
// or
// node scripts/programatic-langs.js

/**
 * @fileoverview This generates joke-langs & testing stuff for src/lib/resources/localization/translation/language
 * Run this before indexing the folder or they wont be listed by translation-index.js
 * Make sure to tell finished-percentage to mark these language codes as 100% translated to avoid logs & stuff
 */
import fs from "fs"
import path from "path"
const folderPath = path.join(import.meta.dirname, "../src/lib/resources/localization/translation/language/");

import en from '../src/lib/resources/localization/translation/language/en.json' with { type: "json" };
import randomNumbers from "./random-numbers.js";

// LIST OF TRANSLATED JOKE LANGS (programatic ones are added in the functions below):
const madeJokeLangs = [];
// NOTE: If we ever wanted to add a joke lang that is NOT programatic, then add it to the list like so:
// TODO: UNIMPORTANT: this is a little scuffed maybe we shouldnt have it work like that
// madeJokeLangs.push("lolcat");

// LANGUAGES:
// NOTE: This is structured so we never re-use anything between langs
// NOTE: Never use anything 100% random so that languages stay consistent across generations. Use a random func that doesn't get affected by other languages also using it. (see really-big for an example)
// NOTE: Programatic languages that edit English text should be prefixed with en- (this applies to other languages also)

// test
(() => {
    const testLang = {"---_PROGRAMATIC": "true"};
    for (const key in en) {
        testLang[key] = key;
    }
    fs.writeFileSync(path.join(folderPath, "test.json"), JSON.stringify(testLang, null, 4), "utf8");
    madeJokeLangs.push("test");
    console.log("PROGRAMATIC LANGS: test");
})();
// en-but-again
(() => {
    // NOTE: This language just exists to test how non-en langs behave while still having en text
    const myLang = { "---_PROGRAMATIC": "true" };
    for (const key in en) {
        myLang[key] = en[key];
    }
    myLang["lang.name"] = "English (but again)";
    fs.writeFileSync(path.join(folderPath, "en-but-again.json"), JSON.stringify(myLang, null, 4), "utf8");
    madeJokeLangs.push("en-but-again");
    console.log("PROGRAMATIC LANGS: en-but-again");
})();
// en-but-rtl
(() => {
    // NOTE: This is a copy of en.json because RTL is defined in translation-index
    const myLang = { "---_PROGRAMATIC": "true" };
    for (const key in en) {
        myLang[key] = en[key];
    }
    myLang["lang.name"] = "English (right-to-left)";
    fs.writeFileSync(path.join(folderPath, "en-but-rtl.json"), JSON.stringify(myLang, null, 4), "utf8");
    madeJokeLangs.push("en-but-rtl");
    console.log("PROGRAMATIC LANGS: en-but-rtl");
})();
// en-scream
(() => {
    const myLang = { "---_PROGRAMATIC": "true" };
    for (const key in en) {
        myLang[key] = String(en[key]).toUpperCase() + "!!!";
    }
    fs.writeFileSync(path.join(folderPath, "en-scream.json"), JSON.stringify(myLang, null, 4), "utf8");
    madeJokeLangs.push("en-scream");
    console.log("PROGRAMATIC LANGS: en-scream");
})();
// en-reversed
(() => {
    const myLang = { "---_PROGRAMATIC": "true" };
    for (const key in en) {
        myLang[key] = String(en[key]).split("").reverse().join("");
    }
    fs.writeFileSync(path.join(folderPath, "en-reversed.json"), JSON.stringify(myLang, null, 4), "utf8");
    madeJokeLangs.push("en-reversed");
    console.log("PROGRAMATIC LANGS: en-reversed");
})();
// en-flipped
(() => {
    const upsideDownMap = {
        'a': '\u0250',
        'b': 'q',
        'c': '\u0254',
        'd': 'p',
        'e': '\u01DD',
        'f': '\u025F',
        'g': '\u0183',
        'h': '\u0265',
        'i': '\u0131',
        'j': '\u027E',
        'k': '\u029E',
        'l': '\u0283',
        'm': '\u026F',
        'n': 'u',
        'o': 'o',
        'p': 'd',
        'q': 'b',
        'r': '\u0279',
        's': 's',
        't': '\u0287',
        'u': 'n',
        'v': '\u028C',
        'w': '\u028D',
        'x': 'x',
        'y': '\u028E',
        'z': 'z',
        'A': '\u2200',
        'B': 'B',
        'C': '\u0186',
        'D': 'D',
        'E': '\u018E',
        'F': '\u2132',
        'G': '\u2141',
        'H': 'H',
        'I': 'I',
        'J': '\u017F',
        'K': 'K',
        'L': '\u2142',
        'M': 'W',
        'N': 'N',
        'O': 'O',
        'P': '\u0500',
        'Q': 'Q',
        'R': 'R',
        'S': 'S',
        'T': '\u22A5',
        'U': '\u2229',
        'V': '\u039B',
        'W': 'M',
        'X': 'X',
        'Y': '\u2144',
        'Z': 'Z'
    };
    const myLang = { "---_PROGRAMATIC": "true" };
    for (const key in en) {
        myLang[key] = String(en[key]).split("").map(char => upsideDownMap[char] || char).reverse().join("");
    }
    fs.writeFileSync(path.join(folderPath, "en-flipped.json"), JSON.stringify(myLang, null, 4), "utf8");
    madeJokeLangs.push("en-flipped");
    console.log("PROGRAMATIC LANGS: en-flipped");
})();
// bleh
(() => {
    const myLang = { "---_PROGRAMATIC": "true" };
    for (const key in en) {
        myLang[key] = String(en[key]).split(" ").map(word => {
            if (word === word.toUpperCase()) return "BLEH";
            if (word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()) return "Bleh";
            return "bleh";
        }).join(" ");
    }
    fs.writeFileSync(path.join(folderPath, "bleh.json"), JSON.stringify(myLang, null, 4), "utf8");
    madeJokeLangs.push("bleh");
    console.log("PROGRAMATIC LANGS: bleh");
})();
// en-braille
(() => {
    const map = {
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓',
        'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏',
        'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
        'y': '⠽', 'z': '⠵'
    };
    const myLang = { "---_PROGRAMATIC": "true" };
    for (const key in en) {
        myLang[key] = String(en[key]).split("").map(char => map[char.toLowerCase()] || char).join("");
    }
    fs.writeFileSync(path.join(folderPath, "en-braille.json"), JSON.stringify(myLang, null, 4), "utf8");
    madeJokeLangs.push("en-braille");
    console.log("PROGRAMATIC LANGS: en-braille");
})();
// really-big
(() => {
    let currentIndex = 0;
    const lutRandom = () => {
        currentIndex = (currentIndex + 1) % randomNumbers.length;
        return randomNumbers[currentIndex];
    };
    
    const generateRandomBase64 = (length) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(lutRandom() * chars.length));
        }
        return result;
    };
    const myLang = { "---_PROGRAMATIC": "true" };
    for (const key in en) {
        myLang[key] = generateRandomBase64(String(en[key]).length)
            + " " + generateRandomBase64(String(en[key]).length)
            + " " + generateRandomBase64(String(en[key]).length)
            + " " + generateRandomBase64(String(en[key]).length)
            + " " + generateRandomBase64(String(en[key]).length)
            + " " + generateRandomBase64(String(en[key]).length)
            + " " + generateRandomBase64(String(en[key]).length)
            + " " + generateRandomBase64(String(en[key]).length);
    }
    myLang["lang.name"] = "REAlly big random stuff";
    fs.writeFileSync(path.join(folderPath, "really-big.json"), JSON.stringify(myLang, null, 4), "utf8");
    madeJokeLangs.push("really-big");
    console.log("PROGRAMATIC LANGS: really-big");
})();
// en-leetspeak
(() => {
    const leetMap = {
        'a': '4', 'A': '4',
        'e': '3', 'E': '3',
        'i': '1', 'I': '1',
        'o': '0', 'O': '0',
        's': '5', 'S': '5',
        't': '7', 'T': '7'
    };
    const myLang = { "---_PROGRAMATIC": "true" };
    for (const key in en) {
        myLang[key] = String(en[key])
            .split('')
            .map(char => leetMap[char] || char)
            .join('');
    }
    myLang["lang.name"] = "1337";
    fs.writeFileSync(path.join(folderPath, "en-leetspeak.json"), JSON.stringify(myLang, null, 4), "utf8");
    madeJokeLangs.push("en-leetspeak");
    console.log("PROGRAMATIC LANGS: en-leetspeak");
})();
// nothing
(() => {
    // NOTE: This language probably renders default text only
    const myLang = { "---_PROGRAMATIC": "true" };
    for (const key in en) {
        myLang[key] = "";
    }
    fs.writeFileSync(path.join(folderPath, "nothing.json"), JSON.stringify(myLang, null, 4), "utf8");
    madeJokeLangs.push("nothing");
    console.log("PROGRAMATIC LANGS: nothing");
})();
// zwspace
(() => {
    // NOTE: This language is just what "nothing" is probably expected to be visually
    const myLang = { "---_PROGRAMATIC": "true" };
    for (const key in en) {
        myLang[key] = "\u200B";
    }
    fs.writeFileSync(path.join(folderPath, "zwspace.json"), JSON.stringify(myLang, null, 4), "utf8");
    madeJokeLangs.push("zwspace");
    console.log("PROGRAMATIC LANGS: zwspace");
})();


fs.writeFileSync(path.join(folderPath, "jokelangs.txt"), `${JSON.stringify(madeJokeLangs)}`, "utf8");
console.log("wrote jokelangs.txt");