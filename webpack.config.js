const CopyPlugin = require('copy-webpack-plugin');

const Dotenv = require('dotenv-webpack');

const path = require('path');
const outputPath = 'dist';
const entryPoints = {
    'items-screen': [path.resolve(__dirname, 'src', 'items-screen', 'items-screen-functionality.ts')],
    'item-screen': [path.resolve(__dirname, 'src', 'item-screen', 'item-screen-functionality.ts')],
    background: path.resolve(__dirname, 'src', 'background.ts')
};

module.exports = (env, argv) => {

    const isProduction = argv.mode === 'production';

    return {

        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300,
            poll: 1000
        },

        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? false : 'source-map',
        optimization: {
            minimize: isProduction
        },
        entry: entryPoints,
        output: {
            path: path.join(__dirname, outputPath),
            filename: '[name].js',
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg)$/i,
                    use: 'url-loader?limit=1024'
                }
            ],
        },
        plugins: [
            new CopyPlugin({
                patterns: [{ from: '.', to: '.', context: 'public' }]
            }),


            new Dotenv(),
        ]
    }
};