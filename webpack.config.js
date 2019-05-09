const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');


module.exports = {
    mode: 'development',
    entry: {
        main: './src/js/index.js',
        input: './src/js/input/input.js'
    },
    output: {
        filename: '[name].bundle.js',
        // path to backend, allows Spring to deliver the bundle
        path: path.resolve(__dirname, 'dist') //'/Users/max/Projects/IntelliJProjects/calendar/src/main/resources/public' //path.resolve(__dirname, 'dist')
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 8081,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: 'Calendar',
            template: './src/index.html',
            chunks: ['main'],
            filename: './index.html'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            title: 'Add Activities',
            template: 'src/input.html',
            chunks: ['input'],
            filename: './input.html'
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};