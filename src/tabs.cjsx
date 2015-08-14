React = require 'react/addons'
_ = require 'lodash'

Router = require 'react-router'
Link = Router.Link

Tab = require('./tab')

module.exports =
React.createClass
  render: ->
    <ul className='row tabs-row'>
      {_.map @props.tabs, (tab) =>
        <Tab href={tab.href} path={tab.path} active={tab.active}/>
      }
      <Link to='file' params={{ splat: @props.new_tab_href }}>
        <li className='tab tab-new col s3'>
          <div>+ New tab</div>
        </li>
      </Link>
    </ul>
