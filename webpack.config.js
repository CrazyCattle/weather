var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var config = {
  devTool: 'source-map',
  entry: './src/main.js',
  output: {
    path: './dist',
    filename: 'base.bundle.js',
    publicPath: '/',
  },
  module: {
    noParse: [],
    loaders: [{
      test: /\.less$/,
      loader: 'style!css!postcss!less'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'ng-annotate!babel'
    }]
  },
  plugins: [
    new ngAnnotatePlugin({
      add: true
    })
  ],
  postcss: function() {
    return [require('autoprefixer'), require('precss')];
  },
  resolve: {
    alias: {},
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    externals: {
      'angular': 'angular'
    },
    extensions: ['', '.json', '.js']
  }
}

module.exports = config;
