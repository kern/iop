var socket = io()

var App = React.createClass({
  render: function () {
    return <main>
      <MapPanel />
      <InfoPanel />
    </main>
  }
})

var MapPanel = React.createClass({

  getInitialState: function () {
    return {
      robots: [],
      trash: []
    }
  },

  componentDidMount: function () {
    var self = this
    socket.on('robots', function (r) {
      self.setState({
        robots: r
      })
    })
    socket.on('trash', function (t) {
      self.setState({
        trash: t
      })
    })
  },

  render: function () {
    return <div className="map-panel">
      {this.state.robots.map(function (r) {
        return <Robot key={r.id} h={r.h} v={r.v} broken={r.broken} />
      })}

      {this.state.trash.map(function (t) {
        return <Trash key={t.id} id={t.id} h={t.h} v={t.v} marked={t.marked} />
      })}
    </div>
  }

})

var InfoPanel = React.createClass({

  getInitialState: function () {
    return {
      messages: [],
      count: 0
    }
  },

  componentDidMount: function () {
    var self = this
    socket.on('message', function (m) {
      self.setState({
        messages: [{
          id: self.state.count,
          text: m
        }].concat(self.state.messages),
        count: self.state.count + 1
      })
    })
  },

  render: function () {
    return <div className="info-panel">
      <div className="inner">
        <h2>Information Feed</h2>
        <ul>
          {this.state.messages.map(function (o) {
            return <li key={o.id}>{o.text}</li>
          })}
        </ul>
      </div>
    </div>
  }

})

var Robot = React.createClass({

  render: function () {
    var style = {
      top: this.props.v + '%',
      left: this.props.h + '%'
    }

    var classes = ['robot']
    if (this.props.broken) classes.push('broken')

    return <div className={classes.join(' ')} style={style} />
  }

})

var Trash = React.createClass({

  onClick: function () {
    if (!this.props.marked)
      socket.emit('mark', this.props.id)
  },

  render: function () {
    var style = {
      top: this.props.v + '%',
      left: this.props.h + '%'
    }

    var classes = ['trash']
    if (this.props.marked) classes.push('marked')

    return <div className={classes.join(' ')} style={style} onClick={this.onClick} />
  }

})

React.render(<App />, document.getElementById('app'));
