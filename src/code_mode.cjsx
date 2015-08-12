React = require 'react/addons'
_ = require 'lodash'

Router = require 'react-router'
RouteHandler = Router.RouteHandler

Tab = require('./tab')

module.exports =
React.createClass
  getInitialState: ->
    tabs: [
      {
        path: '/index.html',
        content: 'h2 Nope'
      },
      {
        path: '/index.html',
        content: 'h2 Nope'
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
            </ul>
            <RouteHandler {...@props}/>
          </div>
        </div>
      </div>
    </div>
