React = require 'react/addons'
Browser = require('./browser')

module.exports =
React.createClass
  render: ->
    <div>
      <div className='row'>
        <div className='col browser-col full m12'>
          <Browser ref='browser' />
        </div>
      </div>
    </div>
