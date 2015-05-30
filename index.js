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

var trash = [{
  id: 0,
  h: 45,
  v: 30,
  marked: false,
  allocated: null
}, {
  id: 1,
  h: 60,
  v: 65,
  marked: false,
  allocated: null
}, {
  id: 2,
  h: 70,
  v: 55,
  marked: false,
  allocated: null
}, {
  id: 3,
  h: 80,
  v: 80,
  marked: false,
  allocated: null
}, {
  id: 4,
  h: 37,
  v: 68,
  marked: false,
  allocated: null
}]

var robots = [{
  id: 0,
  h: 50,
  v: 20,
  target: null,
  allocated: null
}, {
  id: 1,
  h: 30,
  v: 75,
  target: null,
  allocated: null
}, {
  id: 2,
  h: 77,
  v: 70,
  target: null,
  allocated: null
}]

function updateTarget(id) {
  robots[id].target = [Math.random() * 100, Math.random() * 100]
}

updateTarget(0)
updateTarget(1)
updateTarget(2)

function distBetween(r, t) {
  return Math.sqrt(Math.pow(r.h - t.h, 2) +
                   Math.pow(r.v - t.v, 2))
}

function reallocateRobots() {
  for (var t of trash) {
    t.allocated = null
  }

  for (var r of robots) {
    r.allocated = null
  }
}

setInterval(function () {
  var speed = 0.1
  var proximity = 2

  for (var t of trash) {
    if (t.marked && t.allocated === null) {
      var bestRobot = null
      var bestDist = Infinity
      for (var robot of robots) {
        if (robot.allocated !== null) continue
        var dist = distBetween(robot, t)
        if (dist < bestDist) {
          bestRobot = robot
          bestDist = dist
        }
      }
      if (bestRobot === null) continue
      t.allocated = bestRobot.id
      bestRobot.target = [t.h, t.v]
      bestRobot.allocated = t.id
    }
  }

  var reallocate = false

  for (var robot of robots) {
    robot.h = robot.h + (robot.h > robot.target[0] ? -1 : 1) * speed
    robot.v = robot.v + (robot.v > robot.target[1] ? -1 : 1) * speed

    if (Math.sqrt(Math.pow(robot.h - robot.target[0], 2) +
                  Math.pow(robot.v - robot.target[1], 2)) <= proximity) {
      updateTarget(robot.id)
      for (var t of trash) {
        if (t.allocated === robot.id) {
          // Unmark!
          t.marked = false
          reallocate = true
        }
      }
    }
  }

  if (reallocate) reallocateRobots()

  io.emit('robots', robots)
  io.emit('trash', trash)

}, 100)

io.on('connection', function (socket) {

  socket.on('mark', function (trashID) {
    trash[trashID].marked = true
    reallocateRobots()
  })

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
