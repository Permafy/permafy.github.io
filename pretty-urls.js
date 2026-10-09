const fs = require('fs');
const path = require('path');

const buildDirectory = path.resolve(__dirname, 'build');
const configuredRoot = process.env.ROOT || '/';
const root = configuredRoot.endsWith('/') ? configuredRoot : `${configuredRoot}/`;
const legacyPages = fs.readdirSync(buildDirectory)
    .filter(filename => filename.endsWith('.html') && filename !== 'index.html' && filename !== '404.html');

for (const filename of legacyPages) {
    const slug = filename.slice(0, -'.html'.length);
    const legacyPath = path.join(buildDirectory, filename);
    const pageDirectory = path.join(buildDirectory, slug);
    const pagePath = path.join(pageDirectory, 'index.html');
    const target = `${root}${slug}/`;

    fs.mkdirSync(pageDirectory, {recursive: true});
    fs.copyFileSync(legacyPath, pagePath);
    fs.writeFileSync(legacyPath, `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <link rel="canonical" href="${target}">
    <meta http-equiv="refresh" content="0;url=${target}">
    <title>Redirecting</title>
    <script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
</head>
<body><a href="${target}">Continue</a></body>
</html>
`);
}
