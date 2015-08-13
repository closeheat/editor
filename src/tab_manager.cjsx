React = require 'react/addons'

Editor = require('./editor')
FileManager = require('./file_manager')

module.exports =
React.createClass
  renderEditor: ->
    content = fs.readFileSync("/#{@path()}").toString()

    <Editor value={content} path={@path()} onChange={@props.editorChange} />
  isFile: ->
    try
      fs.readFileSync("/#{@path()}")
      true
    catch e
      false
  path: ->
    @props.params.splat
  renderFileManager: ->
    <FileManager path={@path()} />
  render: ->
    if @isFile()
      @renderEditor()
    else
      @renderFileManager()
