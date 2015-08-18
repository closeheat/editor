React = require 'react/addons'
_ = require 'lodash'

Router = require 'react-router'
Link = Router.Link

Tab = require('./tab')

module.exports =
React.createClass
  getInitialState: ->
    {
      flash: false
    }
  onNewTab: ->
    @setState(flash: true)
    setTimeout((=> @setState(flash: false)), 500)
  render: ->
    <ul className='row tabs-row'>
      {_.map @props.tabs, (tab) =>
        <Tab href={tab.href} close_href={tab.close_href} path={tab.path} active={tab.active} flash={@state.flash}/>
      }
      <li className='tab tab-new col s2'>
        <Link to='file' params={{ splat: @props.new_tab_href }} onClick={@onNewTab}>
          <div>+ New tab</div>
        </Link>
      </li>
    </ul>
