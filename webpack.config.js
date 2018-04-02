var webpack = require('webpack');
var path = require('path');
var glob = require('glob');

let ExtractTextPlugin = require("extract-text-webpack-plugin");
let PurifyCSSPlugin = require('purifycss-webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin')

let isProduction = (process.env.NODE_ENV === 'production');


module.exports = {
    entry: {
        main: [
            './src/main.js',
            './src/main.scss'
        ],
        vendor: [
            'jquery',
            'jqueryui'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /.s[ac]ss$/,
                loader: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader'
                  })
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[hash].[ext]'
                        }
                    }
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),

        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'index.html')),
            minimize: isProduction
        }),

        new CleanWebpackPlugin(['dist'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: isProduction
        }),

        function () {
            this.plugin('done', stats => {
                // require file system
                require('fs').writeFileSync(
                    path.join(__dirname, 'dist/manifest.json'),
                    JSON.stringify(stats.toJson().assetsByChunkName)
                );
            });
        }
    ]
}

if (isProduction) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
}

