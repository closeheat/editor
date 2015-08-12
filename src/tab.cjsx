React = require 'react/addons'

Router = require 'react-router'
Link = Router.Link

module.exports =
React.createClass
  render: ->
    <li>
      <Link to='file' params={{ path: @props.path }}>
        <div>{@props.path}</div>
      </Link>
    </li>
