const RelativeErrorsWebpackPlugin = require('./util/relativeErrorsWebpackPlugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractText = new ExtractTextPlugin({
    filename: './styles/_all.css',
    allChunks: true,
    disable: false  //process.env.NODE_ENV === "development"
});

module.exports = {
    context: __dirname + '/src/main/resources/assets',
    entry: {
        bundle: './js/main.ts'
    },
    output: {
        path: __dirname + '/build/resources/main/assets',
        filename: './js/[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.less', '.css']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            },
            {
                test: /\.less$/,
                use: extractText.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?importLoaders=1!less-loader'
                })
            },
            {
                test: /\.(eot|woff|woff2|ttf)$/,
                use: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                use: 'file-loader?name=img/[name].[ext]'
            },
        ]
    },
    plugins: [
        RelativeErrorsWebpackPlugin,
        extractText
    ],
    devtool: 'source-map'
};
