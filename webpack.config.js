const path = require('path');
const glob = require('glob');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const entry = require("./src/webpack_config/entry_webpack.js");
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');

if(process.env.type== "build"){
  var website={
    publicPath:"http://192.168.0.106:1717/"
  }
}else{
  var website={
    publicPath:"http://cdn.jspang.com/"
  }
}
module.exports={
  entry:entry.path,
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].js',
    publicPath:website.publicPath
  },
  module:{
    rules:[
      {
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: [{loader:"css-loader",options:{importLoaders:1}},'postcss-loader']
        })
      },
      {
        test:/\.(png|jpg|gif)/ ,
        use:[{
          loader:'url-loader',
          options:{
            limit:5000,
            outputPath:'images/'
          }
        }]
      },
      {
        test: /\.(htm|html)$/i,
        use:[ 'html-withimg-loader']
      },
      {
        test: /\.less$/,
        use: extractTextPlugin.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "less-loader"
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      },
      {
        test: /\.(js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude:/node_modules/
      }
    ]
  },
  plugins:[
    new uglify(),
    new htmlPlugin({
       minify:{
         // 去掉html页面里的""号
         removeAttributeQuotes:true
       },
      hash:true,
      template:'./src/index.html'
    }),
    // p配置打包后css的位置和名字
    new extractTextPlugin("css/index.css"),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html'))
    }),
    new webpack.BannerPlugin('1830'),
    new copyWebpackPlugin([{
      from:__dirname+'/src/public',
      to:'./public'
    }])
  ],
  devServer:{
    contentBase:path.resolve(__dirname,'dist'),
    host:'192.168.0.106',
    compress:true,
    port:1717
  }
}