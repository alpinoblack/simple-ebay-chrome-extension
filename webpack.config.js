const CopyPlugin = require('copy-webpack-plugin');

const Dotenv = require('dotenv-webpack');

const path = require('path');
const outputPath = 'dist';
const entryPoints = {
    content: [
        path.resolve(__dirname, 'src', 'content.ts'),
    ],
    "messages-to-background": [
        path.resolve(__dirname, 'src', 'messages-to-background.ts'),
    ],
    "image-rotate": [path.resolve(__dirname, 'src', 'image-rotate.ts')],
    background: path.resolve(__dirname, 'src', 'background.ts')
};

module.exports = (env, argv) => {

    const isProduction = argv.mode === 'production';

    return {
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