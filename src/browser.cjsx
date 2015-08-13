React = require 'react'

module.exports =
Browser = React.createClass
  refresh: ->
    document.getElementById('browser').src = 'http://web.closeheatapp.com'
  render: ->
    <div className='browser'>
      <iframe id='browser' name='browser-frame' src='http://web.closeheatapp.com'></iframe>
    </div>
