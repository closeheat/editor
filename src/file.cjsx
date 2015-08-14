React = require 'react/addons'

Router = require 'react-router'
Navigation = Router.Navigation

module.exports =
React.createClass
  mixins: [Navigation],
  activeClass: ->
    result = 'tab col m2'
    result += ' tab-active' if @props.active
    result
  onClick: ->
    @transitionTo('file', splat: @props.file.href)
  render: ->
    <tr onClick={@onClick}>
      <td>
        {@props.file.type}
      </td>
      <td>
        {@props.file.name}
      </td>
      <td>
        {@props.file.type}
      </td>
    </tr>
