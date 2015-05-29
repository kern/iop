var express = require('express')
var http = require('http')
var path = require('path')
var sassMiddleware = require('node-sass-middleware')
var socketIO = require('socket.io')

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

var trash = [{
  id: 0,
  h: 45,
  v: 30
}, {
  id: 1,
  h: 60,
  v: 65
}, {
  id: 2,
  h: 70,
  v: 55
}, {
  id: 3,
  h: 80,
  v: 80
}, {
  id: 4,
  h: 37,
  v: 68
}]

var robots = [{
  id: 0,
  h: 50,
  v: 20,
  target: null
}, {
  id: 1,
  h: 30,
  v: 75,
  target: null
}, {
  id: 2,
  h: 77,
  v: 70,
  target: null
}]

function updateTarget(id) {
  robots[id].target = [Math.random() * 100, Math.random() * 100]
}

updateTarget(0)
updateTarget(1)
updateTarget(2)

setInterval(function () {
  var speed = 0.1
  var proximity = 2

  for (var robot of robots) {
    robot.h = robot.h + (robot.h > robot.target[0] ? -1 : 1) * speed
    robot.v = robot.v + (robot.v > robot.target[1] ? -1 : 1) * speed

    if (Math.sqrt(Math.pow(robot.h - robot.target[0], 2) +
                  Math.pow(robot.v - robot.target[1], 2)) <= proximity) {
      updateTarget(robot.id)
    }
  }

  io.emit('robots', robots)
}, 100)

io.on('connection', function (socket) {

  socket.on('disconnect', function () {
  })

})
