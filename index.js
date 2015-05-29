var express = require('express')
var path = require('path')
var sassMiddleware = require('node-sass-middleware')

var app = express()

app.use(sassMiddleware({
  src: path.join(__dirname, 'css'),
  dest: path.join(__dirname, 'static'),
  outputStyle: 'compressed'
}))

app.use(express.static(path.join(__dirname, 'static')))

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('IoP listening on ' + host + ':' + port)
})
