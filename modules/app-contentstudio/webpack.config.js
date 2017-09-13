const RelativeErrorsWebpackPlugin = require('./util/relativeErrorsWebpackPlugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    context: __dirname + '/src/main/resources',
    entry: {
        bundle: './assets/js/main.ts',
        'page-editor': './page-editor/js/main.ts'
    },
    output: {
        path: __dirname + '/build/resources/main/',
        filename: './assets/js/[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.less', '.css']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            },
            {
                test: /\.less$/,
                // use: ExtractTextPlugin.extract({
                use: ['css-loader', 'less-loader']//,
                //fallback: 'style-loader' // use style-loader in development
                // })
            }
        ]
    },
    plugins: [
        RelativeErrorsWebpackPlugin//,
        /*        new ExtractTextPlugin({
                    filename: "./page-editor/styles/page-editor_all.css",
                    allChunks: true,
                    disable: false //process.env.NODE_ENV === "development"
                })*/
    ],
    devtool: 'source-map'
};
