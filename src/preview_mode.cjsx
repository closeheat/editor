React = require 'react/addons'
Browser = require('./browser')

module.exports =
React.createClass
  render: ->
    <div>
      <div className='row'>
        <div className='col browser-col full m12'>
          <Browser initial_content={@props.browser_content} base={@props.base} ref='browser' />
        </div>
      </div>
    </div>
