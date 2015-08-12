React = require 'react/addons'
jade = require 'jade-memory-fs'
_ = require 'lodash'
$ = window.jQuery = window.$ = require 'jquery'

Browser = require('./browser')
Editor = require('./editor')
Header = require './header'

module.exports =
CodeMode = React.createClass
  getInitialState: ->
    browser_content: @indexHTML()
    editor_content: @rawIndex()

  indexFilename: ->
    try
      fs.readFileSync('/index.jade')
      return '/index.jade'
    catch e
      '/index.html'

  indexHTML: ->
    return @rawIndex() if @indexFilename() == '/index.html'

    md = require('marked')
    jade.filters.md = md
    jade.renderFile(@indexFilename())

  rawIndex: ->
    fs.readFileSync(@indexFilename()).toString()

  editorChange: (new_content) ->
    @setState(editor_content: new_content)

    # @goToStep(2) if @state.loaded
    @setState(loaded: true) if new_content == @state.editor_content

  render: ->
    <div>
      <Header
        index_filename={@indexFilename()}
        editor_content={@state.editor_content}
        index_html={@indexHTML()}
        raw_index={@rawIndex()}/>

      <div className='row'>
        <div className='col editor-col full m5'>
          <div className='editor'>
            <Editor value={@state.editor_content} onChange={@editorChange} index_filename={@indexFilename()} />
          </div>
        </div>
        <div className='col browser-col full m7'>
          <Browser initial_content={@state.browser_content} base={@props.base} ref='browser' />
        </div>
      </div>
    </div>
