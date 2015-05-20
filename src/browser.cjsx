React = require 'react'

module.exports =
Browser = React.createClass
  src: ->
    "data:text/html;charset=utf-8,#{encodeURIComponent(@code())}"
  code: (content) ->
    result = content
    result = result.replace(/href\=\"(?!http:\/\/)(?!https:\/\/)/g, 'href="' + @props.base + '/')
    result.replace(/src\=\"(?!http:\/\/)(?!https:\/\/)/g, 'src="' + @props.base + '/')
  refresh: (content) ->
    document = frames['browser-frame'].document
    document.open()
    document.write(@code(content))
  componentDidMount: ->
    @refresh(@props.initial_content)
  render: ->
    <div className='browser'>
      <iframe id='browser' name='browser-frame'></iframe>
    </div>
