const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const { ModuleFederationPlugin } = webpack.container

module.exports = {
  mode: 'development',

  devtool: 'source-map',

  entry: {
    remote: './src/main.tsx',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
    },
  },

  output: {
    publicPath: 'http://localhost:3001/',
    path: path.resolve(__dirname, '.dist'),
    filename: '[name].bundle.js',
    library: { type: 'global', name: 'hostApp' }, // ONLY this
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new ModuleFederationPlugin({
      name: 'hostApp',
      filename: 'remoteEntry.js',
      library: {
        type: 'var', // ⭐ use global (not var)
        name: 'hostApp',
      },
      exposes: {
        './Card': './src/components/ui/card/index.ts',
        './ReactUtils': './src/reactUtils.ts',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-dom/client': { singleton: true },
      },
    }),
  ],

  devServer: {
    static: {
      directory: path.resolve(__dirname, '.dist'),
    },

    // Make sure remoteEntry.js is written to disk
    devMiddleware: {
      writeToDisk: true,
    },

    port: 3001,
    open: true,
    historyApiFallback: true,

    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              [
                '@babel/preset-react',
                {
                  runtime: 'classic', // ⬅️ REQUIRED
                  development: false, // ⬅️ Important for MF hosting in Angular
                  useBuiltIns: false, // ⬅️ Prevents transitional element output
                },
              ],
              '@babel/preset-typescript',
            ],
          },
        },
      },

      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },

      {
        test: /\.(png|jpeg|gif|jpg)$/i,
        type: 'asset/resource',
      },
    ],
  },
}
