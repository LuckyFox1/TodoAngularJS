'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

module.exports = {
    context: __dirname + '/public/',

    entry: {
        todo: './js/todo'
    },

    output: {
        path: __dirname + '/public/script',
        filename: '[name].js'
    },

    watch: NODE_ENV == 'development',

    watchOptions: {
        aggregateTimeout: 100
    },

    devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : false,

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            'angular': 'angular'
        }),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            LANG: JSON.stringify('ru')
        })
    ],

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.css']
    },

    resolveLoader: {
        moduleExtensions: ['*-loader', '*'],
        modules: ['node_modules'],
        extensions: ['.js', '.css']
    },

    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader?presets[]=es2015'
        }, {
            test: require.resolve('angular'),
            loader: 'exports-loader?window.angular'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test:   /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
            loader: 'file-loader?name=[path][name].[ext]'
        }]
    }
};
