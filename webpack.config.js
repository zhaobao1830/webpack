const path=require('path');
const uglify=require('uglifyjs-webpack-plugin');
const htmlPlugin=require('html-webpack-plugin');
module.exports={
  entry:{
    entry:'./src/entry.js',
    entry2:'./src/entry2.js'
  },
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].js'
  },
  module:{
    rules:[
      {
        test:/\.css$/,
        use: ["style-loader", "css-loader"]
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
    })
  ],
  devServer:{
    contentBase:path.resolve(__dirname,'dist'),
    host:'192.168.0.104',
    compress:true,
    port:1717
  }
}