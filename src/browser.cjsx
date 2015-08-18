React = require 'react'

module.exports =
Browser = React.createClass
  refresh: ->
    document.getElementById('browser').src = @props.browser_url
  render: ->
    <div className='browser'>
      <iframe id='browser' name='browser-frame' src={@props.browser_url}></iframe>
    </div>
