React = require 'react/addons'

Editor = require('./editor')

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
    console.log 'file mamager'
    <div></div>

  render: ->
    if @isFile()
      @renderEditor()
    else
      @renderFileManager()
