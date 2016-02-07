React = require 'react'
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
    setTimeout((=> @setState(flash: false)), 50)
  render: ->
    <ul className='row tabs-row'>
      {_.map @props.tabs, (tab) =>
        <Tab key={tab.href} href={tab.href} close_href={tab.close_href} name={tab.name} active={tab.active} flash={@state.flash}/>
      }
      <li className='tab tab-new col s2'>
        <Link to='file' params={{ splat: @props.new_tab_href }} onClick={@onNewTab}>
          <div>+ New tab</div>
        </Link>
      </li>
    </ul>
