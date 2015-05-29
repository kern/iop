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

  render: function () {
    return <div className="map-panel">
      This is where the map goes.
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
      <h2>Information Feed</h2>
      <ul>
        {this.state.messages.map(function (o) {
          return <li key={o.id}>{o.text}</li>
        })}
      </ul>
    </div>
  }

})

React.render(<App />, document.getElementById('app'));
