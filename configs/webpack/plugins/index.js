const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const getCssPlugin = filename => new MiniCssExtractPlugin({filename, chunkFilename: filename});

const CLEAN_PLUGIN = new CleanWebpackPlugin({cleanStaleWebpackAssets: false});

const HTML_PLUGIN = new HtmlWebpackPlugin({
    title: 'rentalcars',
    filename: 'index.html',
    template: 'client/html/index.ejs',
    inject: false,
    templateParameters: (compilation, assets, assetTags, options) => ({
        compilation,
        webpackConfig: compilation.options,
        htmlWebpackPlugin: {
            tags: {
                headTags: assetTags.headTags.filter(tag => ['link', 'style'].includes(tag.tagName)),
                bodyTags: assetTags.headTags.filter(tag => ['script'].includes(tag.tagName)),
            },
            files: assets,
            options,
        },
    }),
});

module.exports = {
    dev: [CLEAN_PLUGIN, getCssPlugin('[name].css'), HTML_PLUGIN],
    prod: [CLEAN_PLUGIN, getCssPlugin('[name].[contenthash].css'), HTML_PLUGIN],
};
