React = require 'react'

Router = require 'react-router'
Navigation = Router.Navigation

module.exports =
React.createClass
  mixins: [Navigation],
  onClick: ->
    @transitionTo('file', splat: @props.href)
  render: ->
    unless @props.show
      return <tr></tr>

    <tr onClick={@onClick}>
      <td>
      </td>
      <td colSpan=2>
        ...
      </td>
    </tr>
