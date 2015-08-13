React = require 'react'
brace  = require('brace')
AceEditor  = require('react-ace')
_  = require('lodash')

require('brace/mode/html')
require('brace/mode/coffee')
require('brace/mode/jade')
require('brace/theme/xcode')

module.exports =
React.createClass
  getInitialState: ->
    loaded: false
  onChange: (new_content) ->
    @props.onChange(new_content)
  mode: ->
    ext = @props.path.match(/\.(.*)$/)[1] || 'html'

    result = _.detect @supportedModes(), (supported_ext) ->
      supported_ext == ext

    result || 'html'

  supportedModes: ->
    [
      'jade',
      'html',
      'coffee'
    ]
  onLoad: (editor) ->
    editor.clearSelection()
  render: ->
    <AceEditor
      mode={@mode()}
      theme='xcode'
      name='blah1'
      height='calc(100vh - 64px)'
      width='100%'
      onChange={@onChange}
      onLoad={@onLoad}
      value={@props.value}
    />
