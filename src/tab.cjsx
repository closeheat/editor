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
    <li className={@activeClass()}>
      <Link className='tab-name' to='file' params={{ splat: @props.href }}>
        {@props.path || 'Files'}
      </Link>
      <Link className='tab-close' to='file' params={{ splat: @props.close_href }}>
        <i className='material-icons'>close</i>
      </Link>
    </li>
