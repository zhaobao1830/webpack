const path=require('path');
const uglify=require('uglifyjs-webpack-plugin');
const htmlPlugin=require('html-webpack-plugin');
const extractTextPlugin = require("extract-text-webpack-plugin");
var website ={
  publicPath:"http://192.168.0.103:1717/"
}
module.exports={
  entry:{
    entry:'./src/entry.js',
    entry2:'./src/entry2.js'
  },
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
          use: "css-loader"
        })
      },
      {
        test:/\.(png|jpg|gif)/ ,
        use:[{
          loader:'url-loader',
          options:{
            limit:500000
          }
        }]
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
    new extractTextPlugin("/css/index.css")
  ],
  devServer:{
    contentBase:path.resolve(__dirname,'dist'),
    host:'192.168.0.103',
    compress:true,
    port:1717
  }
}