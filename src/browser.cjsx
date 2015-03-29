React = require 'react'
$ = require 'jquery'

module.exports =
Browser = React.createClass
  # componentDidMount: ->
  #   React.render(<embed src={@src()} />, @getDOMNode())
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
  srcHtml: ->
    __html: "<embed src='#{@src()}'>"
  render: ->
    <div dangerouslySetInnerHTML={@srcHtml()}>
    </div>
