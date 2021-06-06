const {PATHS} = require('../../constants');

const {REG_EXP} = require('../../constants');

const getConfig = filePath => [
    {
        test: REG_EXP.images,
        type: 'asset/resource',
        generator: {
            emit: true,
            filename: `images/${filePath}`,
            publicPath: `${PATHS.dist}/`,
        },
    },
    {
        test: REG_EXP.fonts,
        type: 'asset/resource',
        generator: {
            emit: true,
            filename: `fonts/${filePath}`,
            publicPath: `${PATHS.dist}/`,
        },
    },
];

module.exports = {
    dev: getConfig('[name][ext]'),
    prod: getConfig('[name].[contenthash][ext]'),
};
