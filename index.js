var express = require('express')
var http = require('http')
var path = require('path')
var sassMiddleware = require('node-sass-middleware')
var socketIO = require('socket.io')

var api = require('./api')
var fiware = require('./fiware')
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

var bagsUsed = 0

var trash = [{
  id: 0,
  h: 45,
  v: 30,
  marked: false,
  allocated: null,
  ticket: null
}, {
  id: 1,
  h: 60,
  v: 65,
  marked: false,
  allocated: null,
  ticket: null
}, {
  id: 2,
  h: 70,
  v: 55,
  marked: false,
  allocated: null,
  ticket: null
}, {
  id: 3,
  h: 80,
  v: 80,
  marked: false,
  allocated: null,
  ticket: null
}, {
  id: 4,
  h: 37,
  v: 68,
  marked: false,
  allocated: null,
  ticket: null
}]

var robots = [{
  id: 0,
  h: 50,
  v: 20,
  target: null,
  allocated: null,
  broken: false
}, {
  id: 1,
  h: 30,
  v: 75,
  target: null,
  allocated: null,
  broken: false
}, {
  id: 2,
  h: 77,
  v: 70,
  target: null,
  allocated: null,
  broken: false
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
    if (robot.broken) continue
    robot.h = robot.h + (robot.h > robot.target[0] ? -1 : 1) * speed
    robot.v = robot.v + (robot.v > robot.target[1] ? -1 : 1) * speed

    if (Math.sqrt(Math.pow(robot.h - robot.target[0], 2) +
                  Math.pow(robot.v - robot.target[1], 2)) <= proximity) {
      updateTarget(robot.id)
      for (var t of trash) {
        if (t.allocated === robot.id) {
          // Unmark!
          (function(t) {
            bagsUsed++
            if (bagsUsed % 5 === 0) {
              io.emit('message', 'TM Forum Product Order created for more trash bags.')
              api.orderBags()
            }
            t.marked = false
            reallocate = true
            api.fixIncident(t.ticket, function() {
              io.emit('message', 'TM Forum Trouble Ticket closed for trash can ' + t.id + ' with ID ' + t.ticket + '.')
              t.ticket = null
            })
            fiware.updateRequest(t.id, false)
          })(t)
        }
      }
    }
  }

  if (reallocate) reallocateRobots()

  io.emit('robots', robots)
  io.emit('trash', trash)

}, 100)

function breakRobotRandomly() {

  var breakTime = 2000 + Math.random() * 5000
  var fixTime = (5000 + Math.random() * 5000) + breakTime

  var robot = robots[Math.floor(Math.random() * robots.length)]

  setTimeout(function () {
    io.emit('message', 'Ericsson Connected Car API has detected robot ' + robot.id + ' has broken down.')
    robot.broken = true
    api.robotBreakdown(robot.id)
    reallocateRobots()
  }, breakTime)

  setTimeout(function () {
    io.emit('message', 'Ericsson Connect Car API has detected robot ' + robot.id + ' has been fixed.')
    api.robotFix(robot.id)
    robot.broken = false
    reallocateRobots()
    breakRobotRandomly()
  }, fixTime)

}

breakRobotRandomly()

// FIWARE integration

function fillTrashRandomly() {

  var fillTime = 5000 + Math.random() * 5000

  var t = trash[Math.floor(Math.random() * trash.length)]

  setTimeout(function () {
    io.emit('message', 'FIWARE sensor (urn:iop:trash' + t.id + ') detected trash can ' + t.id + ' is full. Dispatching robot...')
    t.marked = true
    reallocateRobots()
    fillTrashRandomly()
    fiware.updateRequest(t.id, true)
  }, fillTime)

}

fillTrashRandomly()

io.on('connection', function (socket) {

  // create trash
  socket.on('mark', function (trashID) {
    trash[trashID].marked = true
    fiware.updateRequest(t.id, true)
    reallocateRobots()
    api.createIncident(trashID, function (response) {
      trash[trashID].ticket = response.httpResponse.body.id
      io.emit('message', 'TM Forum Trouble Ticket created for trash can ' + trashID + ' with id ' + response.httpResponse.body.id + '.')
    })
  })

})
