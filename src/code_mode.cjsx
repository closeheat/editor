React = require 'react/addons'

Router = require 'react-router'
RouteHandler = Router.RouteHandler
Link = Router.Link

Tabs = require('./tabs')

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
              <Tabs full_path={@props.params.splat} />
            </ul>
            <RouteHandler {...@props}/>
          </div>
        </div>
      </div>
    </div>
