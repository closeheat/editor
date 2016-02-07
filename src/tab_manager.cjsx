React = require 'react'
_ = require 'lodash'

Editor = require('./editor')
FileManager = require('./file_manager')
Filesystem = require('./filesystem')

module.exports =
React.createClass
  renderEditor: (file) ->
    <Editor
      value={file.content}
      path={@props.active_tab_path}
      onChange={@props.editorChange}
      supported_modes={@supportedModes()}
      ref='editor'
    />
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
  renderFileManager: (dir) ->
    <FileManager
      dir={dir}
      path={@props.active_tab_path}
      reuseTabHref={@props.reuseTabHref}
      newTabHref={@props.newTabHref}
      supported_modes={@supportedModes()}/>
  fileOrDir: ->
    Filesystem.read(@props.active_tab_path)

  statics:
    willTransitionFrom: (transition, component) ->
      return if component.fileOrDir().type == 'dir'

      component.refs.editor.saveSettings()
  render: ->
    file_or_dir = @fileOrDir()

    if file_or_dir.type == 'dir'
      @renderFileManager(file_or_dir)
    else
      @renderEditor(file_or_dir)
