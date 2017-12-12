const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const DEV = process.env.NODE_ENV !== 'production'

module.exports = {
  bail: !DEV,
  devtool: DEV ? 'cheap-module-source-map' : 'source-map',
  entry: './src/frontend/index.js',
  output: {
    path: __dirname + '/build/frontend',
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          // use: {
          //   loader: "css-loader",
          //   options: {
          //     sourceMap: true
          //   }
          // },
          use: ['css-loader', 'sass-loader'],
          publicPath: ""
        })
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('main.css'),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(DEV ? 'development' : 'production'),
      },
    }),
    !DEV &&
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // React doesn't support IE8
          warnings: false,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: true,
          screw_ie8: true,
        },
      }),
    DEV &&
      new webpack.optimize.AggressiveMergingPlugin(),
  ].filter(Boolean),
};
