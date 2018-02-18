const ErrorLoggerPlugin = require('error-logger-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CircularDependencyPlugin = require('circular-dependency-plugin');

const detectCirculars = new CircularDependencyPlugin({
    // exclude detection of files based on a RegExp
    exclude: /a\.js|node_modules/,
    // add errors to webpack instead of warnings
    failOnError: true
});

module.exports = {
    context: __dirname + '/src/main/resources/assets',
    entry: {
        'js/bundle': './js/main.ts',
        'styles/_all': './styles/_module.less',
        'page-editor/js/_all': './js/page-editor.ts',
        'page-editor/lib/_all': './page-editor/lib/_include.js',
        'page-editor/styles/_all': './page-editor/styles/_module.less'
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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    publicPath: '../../',
                    use: [
                        { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
                        { loader: 'postcss-loader', options: { sourceMap: true, config: { path: '../../postcss.config.js' } } },
                        { loader: 'less-loader', options: { sourceMap: true } }
                    ]
                })
            },
            {
                test: /\.(eot|woff|woff2|ttf)$/,
                use: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                use: 'file-loader?name=img/[name].[ext]'
            }
        ]
    },
    plugins: [
        new ErrorLoggerPlugin(),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true,
            disable: false
        }),
        detectCirculars
    ],
    devtool: 'source-map'
};
