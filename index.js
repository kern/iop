var express = require('express')
var http = require('http')
var path = require('path')
var sassMiddleware = require('node-sass-middleware')
var socketIO = require('socket.io')

var api = require('./api')
var app = express()

app.use(sassMiddleware({
  src: path.join(__dirname, 'css'),
  dest: path.join(__dirname, 'static'),
  outputStyle: 'compressed'
}))

app.use(express.static(path.join(__dirname, 'static')))

var server = new http.Server(app)
var io = socketIO(server)

server.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('IoP listening on ' + host + ':' + port)
})

io.on('connection', function (socket) {

  socket.on('createIncident', function (data, res) {
    api.createIncident(data, res)
  })

  socket.on('blah', function (data, res) {
    // data
    res("foobar")
  })

  // var i = setInterval(function () {
  //   socket.emit('message', 'Hello world')
  // }, 1000)

  // socket.on('disconnect', function () {
  //   clearInterval(i)
  // })
})
