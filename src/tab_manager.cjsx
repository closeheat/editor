React = require 'react/addons'
_ = require 'lodash'

Editor = require('./editor')
FileManager = require('./file_manager')

module.exports =
React.createClass
  renderEditor: ->
    content = fs.readFileSync(fs.join('/', @props.active_tab_path)).toString()

    <Editor value={content} path={@props.active_tab_path} onChange={@props.editorChange} />
  isFile: ->
    try
      fs.readFileSync("/#{@props.active_tab_path}")
      true
    catch e
      false
  renderFileManager: ->
    <FileManager path={@props.active_tab_path} reuseTabHref={@props.reuseTabHref} newTabHref={@props.newTabHref}/>
  render: ->
    if @isFile()
      @renderEditor()
    else
      @renderFileManager()
