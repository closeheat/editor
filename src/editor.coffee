React = require 'react'
brace  = require('brace')
AceEditor  = require('react-ace')

require('brace/mode/html')
require('brace/mode/jade')
require('brace/theme/github')

module.exports =
Editor = React.createClass
  getInitialState: ->
    loaded: false
  onChange: (new_content) ->
    @props.onChange(new_content)
  mode: ->
    if @props.index_filename == '/index.jade'
      'jade'
    else
      'html'
  render: ->
    <AceEditor
      mode={@mode()}
      theme='github'
      name='blah1'
      height='calc(100vh - 100px)'
      width='100%'
      onChange={@onChange}
      value={@props.value}
    />
