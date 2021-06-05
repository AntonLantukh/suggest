const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {REG_EXP} = require('../../constants');

const MINI_CSS_LOADER = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        publicPath: '/',
    },
};

const POST_CSS_LOADER = {
    loader: 'postcss-loader',
};

const STYLE_LOADER = {
    loader: 'style-loader',
    options: {
        insert: 'head',
        injectType: 'singletonStyleTag',
    },
};

const CSS_LOADER = {
    loader: 'css-loader',
    options: {
        modules: {
            compileType: 'module',
        },
    },
};

const CSS_CLIENT_DEV_CONFIG = {
    test: REG_EXP.css,
    use: [MINI_CSS_LOADER, CSS_LOADER, POST_CSS_LOADER],
};

const CSS_CLIENT_PROD_CONFIG = {
    test: REG_EXP.css,
    use: [MINI_CSS_LOADER, CSS_LOADER, POST_CSS_LOADER],
};

module.exports = {
    dev: CSS_CLIENT_DEV_CONFIG,
    prod: CSS_CLIENT_PROD_CONFIG,
};
