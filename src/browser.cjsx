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
    result = result.replace(/href\=\"/, 'href="' + @base())
    result.replace(/src\=\"/, 'src="' + @base())
  base: ->
    'http://testing-editor.closeheatapp.com/'
  embedHTML: ->
    __html: "<embed src='#{@src()}'>"
  render: ->
    <div className='col-xs-6 col-md-6 browser' dangerouslySetInnerHTML={@embedHTML()}>
    </div>
