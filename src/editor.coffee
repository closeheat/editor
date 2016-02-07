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
    @props.supported_modes[ext] || 'html'

  restoreSettings: (editor) ->
    settings = window.CloseheatFileSettings[@props.path]
    return editor.clearSelection() unless settings

    editor.session.selection.setSelectionRange(settings.selection)
    editor.session.setScrollTop(settings.scroll_top)
    editor.session.setScrollLeft(settings.scroll_left)

    # bug in ace?
    settings.undo_manager.$doc = editor.session
    editor.session.setUndoManager(settings.undo_manager)

  onLoad: (editor) ->
    editor_session = editor.getSession()

    editor_session.setTabSize(2)
    editor_session.setUseSoftTabs(true)
    editor.setHighlightActiveLine(false)
    editor_session.setUndoManager(new brace.UndoManager)
    @restoreSettings(editor)

  saveSettings: ->
    editor = @refs.editor_container.editor

    window.CloseheatFileSettings[@props.path] = {
      selection: editor.getSelectionRange() || @emptySelection()
      scroll_top: editor.session.getScrollTop() || 0
      scroll_left: editor.session.getScrollLeft() || 0
      undo_manager: editor.session.getUndoManager()
    }

  render: ->
    <AceEditor
      mode={@mode()}
      theme='xcode'
      name='blah1'
      height='calc(100vh - 54px - 36px)'
      width='100%'
      onChange={@onChange}
      onLoad={@onLoad}
      value={@props.value}
      ref='editor_container'
      editorProps={{$blockScrolling: true}}
    />
