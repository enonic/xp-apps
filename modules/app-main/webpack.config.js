const ErrorLoggerPlugin = require('error-logger-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: `${__dirname}/src/main/resources`,
    entry: {
        home: './assets/js/home/main.js',
        launcher: './assets/js/launcher/main.js',
    },
    output: {
        path: `${__dirname}/build/resources/main/`,
        filename: './assets/js/[name]/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!less-loader'
                })
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader?name=./assets/icons/fonts/[name].[ext]',
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader?name=./assets/icons/favicons/[name].[ext]',
            }
        ]
    },
    plugins: [
        new ErrorLoggerPlugin(),
        new ExtractTextPlugin({
            filename: './assets/styles/[name].css',
            allChunks: true,
            disable: false
        })
    ],
    devtool: 'source-map'
};
