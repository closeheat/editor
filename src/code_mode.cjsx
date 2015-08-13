React = require 'react/addons'
_ = require 'lodash'

Router = require 'react-router'
RouteHandler = Router.RouteHandler
Link = Router.Link

Tab = require('./tab')

module.exports =
React.createClass
  getInitialState: ->
    tabs: [
      {
        path: 'index.jade',
        content: 'h2 Nope'
      },
      {
        path: 'js/app.coffee',
        content: 'var hello;'
      },
    ]
  render: ->
    <div>
      <div className='row'>
        <div className='col editor-col full m12'>
          <div className='editor'>
            <ul>
              {_.map @state.tabs, (tab) ->
                <Tab {...tab}/>
              }
              <Link to='file' params={{ splat: '' }}>
                <div>New tab</div>
              </Link>
            </ul>
            <RouteHandler {...@props}/>
          </div>
        </div>
      </div>
    </div>
