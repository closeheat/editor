React = require 'react/addons'

Editor = require('./editor')
FileManager = require('./file_manager')

module.exports =
React.createClass
  renderEditor: ->
    content = fs.readFileSync("/#{@path()}").toString()

    <Editor value={content} path={@path()} onChange={@props.editorChange} />
  isFile: ->
    !!@path()
  path: ->
    @props.params.splat
  renderFileManager: ->
    <FileManager/>
  render: ->
    if @isFile()
      @renderEditor()
    else
      @renderFileManager()
