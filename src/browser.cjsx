React = require 'react'
$ = require 'jquery'

module.exports =
Browser = React.createClass
  src: ->
    "data:text/html;charset=utf-8,#{encodeURIComponent(@code())}"
  code: ->
    @appendBase(@props.content)
  appendBase: (content) ->
    result = content
    result = result.replace(/href\=\"(?!http:\/\/)(?!https:\/\/)/g, 'href="' + @props.base)
    result.replace(/src\=\"(?!http:\/\/)(?!https:\/\/)/g, 'src="' + @props.base)
  componentDidMount: ->
    document = frames['browser-frame'].document
    document.write(@code())
  componentDidUpdate: ->
    console.log 'new code'
    console.log @code()
    document = frames['browser-frame'].document
    document.write(@code())
  render: ->
    <div className='col-xs-6 col-md-6 browser'>
      <iframe id='browser' name='browser-frame'></iframe>
    </div>
