React = require 'react'
brace  = require('brace')
AceEditor  = require('react-ace')
_  = require('lodash')

require('brace/mode/html')
require('brace/mode/coffee')
require('brace/mode/jade')
require('brace/mode/sass')

require('brace/theme/xcode')

module.exports =
React.createClass
  getInitialState: ->
    loaded: false
  onChange: (new_content) ->
    @props.onChange(@props.path, new_content)
  mode: ->
    ext = @props.path.match(/\.(.*)$/)[1] || 'html'
    @supportedModes()[ext] || 'html'

  supportedModes: ->
    {
      jade: 'jade',
      html: 'html',
      coffee: 'coffee',
      sass: 'sass',
      scss: 'sass'
    }

  onLoad: (editor) ->
    editor.clearSelection()
    editor.getSession().setTabSize(2)
    editor.getSession().setUseSoftTabs(true)
    editor.setHighlightActiveLine(false)
  render: ->
    <AceEditor
      mode={@mode()}
      theme='xcode'
      name='blah1'
      height='calc(100vh - 50px)'
      width='100%'
      onChange={@onChange}
      onLoad={@onLoad}
      value={@props.value}
    />
