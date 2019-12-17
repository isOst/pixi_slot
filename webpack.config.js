const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new CopyPlugin([
            {from: 'src/index.html', to: ''},
            {from: 'src/assets', to: 'assets'}
        ])
        // new HtmlPlugin({
        //     template: 'src/index.html'
        // })
    ],
    devServer: {
        contentBase: './dist'
    }
};
