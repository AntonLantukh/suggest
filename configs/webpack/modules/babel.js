const {REG_EXP} = require('../../constants');

const BASE_PLUGINS = [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
];

const getConfig = plugins => ({
    test: REG_EXP.js,
    exclude: REG_EXP.node_modules,
    use: {
        loader: 'babel-loader',
        options: {
            plugins: [...(plugins || []), ...BASE_PLUGINS],
            cacheDirectory: true,
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
        },
    },
});

module.exports = {
    dev: getConfig(['react-hot-loader/babel']),
    prod: getConfig(),
};
