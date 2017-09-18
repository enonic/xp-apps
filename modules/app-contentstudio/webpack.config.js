const RelativeErrorsWebpackPlugin = require('./util/relativeErrorsWebpackPlugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractText = new ExtractTextPlugin({
    filename: './page-editor/styles/_all.css',
    allChunks: true,
    disable: false  //process.env.NODE_ENV === "development"
});

module.exports = {
    context: __dirname + '/src/main/resources/assets',
    entry: {
        'js/bundle': './js/main.ts',
        'page-editor/js/_all': './page-editor/js/main.ts',
        'page-editor/lib/_all': './page-editor/lib/_include.js',
        'page-editor/styles/styles': './page-editor/styles/_module.less'
    },
    output: {
        path: __dirname + '/build/resources/main/assets',
        filename: './[name].js'
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
                    publicPath: '../../',
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
