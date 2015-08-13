React = require 'react/addons'
_ = require 'lodash'

Router = require 'react-router'
Link = Router.Link

Tab = require('./tab')

module.exports =
React.createClass
  render: ->
    <div>
      {_.map @props.tabs, (tab) =>
        <Tab href={tab.href} path={tab.path} active={tab.active}/>
      }
      <Link to='file' params={{ splat: @props.new_tab_href }}>
        <div>New tab</div>
      </Link>
    </div>
