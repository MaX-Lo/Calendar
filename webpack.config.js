const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/js/index.js',
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: {
        p5: 'p5'
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 8081
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: 'Calendar',
            template: './src/index.html',
            filename: './index.html'
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
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