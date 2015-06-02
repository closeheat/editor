React = require 'react'
brace  = require('brace')
AceEditor  = require('react-ace')

require('brace/mode/html')
require('brace/mode/jade')
require('brace/theme/xcode')

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
      theme='xcode'
      name='blah1'
      height='calc(100vh - 64px)'
      width='100%'
      onChange={@onChange}
      value={@props.value}
    />
