React = require 'react'

module.exports =
Browser = React.createClass
  src: ->
    "data:text/html;charset=utf-8,#{encodeURIComponent(@code())}"
  code: (content) ->
    content.replace('<head>', "<head><base href='#{@props.base}'>")
  refresh: (content) ->
    doc = document.getElementById('browser').contentWindow.document
    doc.open()
    doc.write(@code(content))
    doc.close()
  componentDidMount: ->
    @refresh(@props.initial_content)
  render: ->
    <div className='browser'>
      <iframe id='browser' name='browser-frame'></iframe>
    </div>
