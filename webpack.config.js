const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\\.css$/,
        exclude: /\\.useable\\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\\.useable\\.css$/,
        use: [
          {
            loader: 'style-loader/useable',
            options: {
              singleton: true,
              attrs: { id: 'theia-theme' },
            }
          },
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};