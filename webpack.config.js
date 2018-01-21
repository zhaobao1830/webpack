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
    // 配置JS压缩
    new uglify(),
    // 打包html文件
    new htmlPlugin({
       minify:{
         // 去掉html页面里的""号
         removeAttributeQuotes:true
       },
      hash:true,
      template:'./src/index.html'
    }),
    // 配置打包后css的位置和名字
    // 默认是把css打包进js文件里，extractTextPlugin是把这个css单独提出来打包
    new extractTextPlugin("css/index.css"),
    // 使用purifycss-webpack消除未使用的css
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html'))
    }),
    // 打包以后，添加备注
    new webpack.BannerPlugin('1830'),
    // 把静态资源文件打包出来
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