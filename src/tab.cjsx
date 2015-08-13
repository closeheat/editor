React = require 'react/addons'

Router = require 'react-router'
Link = Router.Link
# Navigation = Router.Navigation

module.exports =
React.createClass
  activeClass: ->
    'active' if @props.active
  render: ->
    <li className={@activeClass()}>
      <Link to='file' params={{ splat: @props.href }}>
        {@props.path}
      </Link>
    </li>
