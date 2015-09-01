React = require 'react'
brace  = require('brace')
AceEditor  = require('react-ace')
_  = require('lodash')

require('brace/mode/html')
require('brace/mode/jade')
require('brace/mode/markdown')
require('brace/mode/text')

require('brace/mode/javascript')
require('brace/mode/coffee')
require('brace/mode/jsx')

require('brace/mode/json')

require('brace/mode/css')
require('brace/mode/sass')

require('brace/theme/xcode')

require('brace/ext/searchbox')

module.exports =
React.createClass
  emptySelection: ->
    {
      start:
        row: 0
        column: 0
      end:
        row: 0
        column: 0
    }

  onChange: (new_content) ->
    @props.onChange(@props.path, new_content)
  mode: ->
    ext = @props.path.match(/\.(.*)$/)[1] || 'html'
    @supportedModes()[ext] || 'html'

  supportedModes: ->
    {
      jade: 'jade',
      html: 'html',
      md: 'markdown',
      coffee: 'coffee',
      js: 'javascript'
      jsx: 'jsx'
      json: 'json'
      sass: 'sass',
      scss: 'sass',
      css: 'css',
      txt: 'text'
    }

  restoreSettings: (editor) ->
    settings = window.CloseheatFileSettings[@props.path]
    return editor.clearSelection() unless settings

    editor.session.selection.setSelectionRange(settings.selection)
    editor.session.setScrollTop(settings.scroll_top)
    editor.session.setScrollLeft(settings.scroll_left)

  onLoad: (editor) ->
    @restoreSettings(editor)
    editor.getSession().setTabSize(2)
    editor.getSession().setUseSoftTabs(true)
    editor.setHighlightActiveLine(false)

  saveSettings: ->
    editor = @refs.editor_container.editor

    window.CloseheatFileSettings[@props.path] = {
      selection: editor.getSelectionRange() || @emptySelection()
      scroll_top: editor.session.getScrollTop() || 0
      scroll_left: editor.session.getScrollLeft() || 0
    }

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
      ref='editor_container'
    />
