React = require 'react/addons'

Router = require 'react-router'
Link = Router.Link
# Navigation = Router.Navigation

module.exports =
React.createClass
  activeClass: ->
    result = 'tab col m2'
    result += ' tab-active' if @props.active
    result
  render: ->
    <Link to='file' params={{ splat: @props.href }}>
      <li className={@activeClass()}>
        {@props.path}
      </li>
    </Link>
