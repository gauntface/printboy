const glob = require('glob');
const postcssPresetEnv = require('postcss-preset-env');
const postcssImport = require("postcss-import");
const cssnano = require('cssnano');
const mkdirp = require('mkdirp');

let plugins = [];

if (process.env.HUGO_ENVIRONMENT === 'production') {
    const varFiles = glob.sync('**/variables/*.css', {
        ignore: ['build/**'],
    });

    const themeAssets = glob.sync('themes/*/assets/', {
        ignore: ['build/**'],
    });

    plugins = [
        postcssImport({
            path: themeAssets,
        }),
        postcssPresetEnv({
            preserve: false,
            importFrom: varFiles,
            exportTo: 'build/static/__postcss/always.css',
        }),
        cssnano(),
    ];

    mkdirp.sync('build/static/__postcss/');
}

module.exports = {
    plugins,
}
