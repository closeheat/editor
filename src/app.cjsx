React = require 'react/addons'
require('./materialize')

Router = require 'react-router'
RouteHandler = Router.RouteHandler

module.exports =
App = React.createClass
  render: ->
    <main>
      <RouteHandler/>
    </main>
