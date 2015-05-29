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
      messages: ['foo', 'bar']
    }
  },

  render: function () {
    return <div className="info-panel">
      <h2>Information Feed</h2>
      <ul>
        {this.state.messages.map(function (m) {
          return <li key={m}>{m}</li>
        })}
      </ul>
    </div>
  }

})

React.render(<App />, document.getElementById('app'));
