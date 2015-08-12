React = require 'react/addons'
jade = require 'jade-memory-fs'
_ = require 'lodash'
$ = window.jQuery = window.$ = require 'jquery'
require('./materialize')

Router = require 'react-router'
RouteHandler = Router.RouteHandler

Header = require './header'

module.exports =
React.createClass
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
    <main>
      <Header />

      <RouteHandler
        base={@props.base}
        index_filename={@indexFilename()}
        editor_content={@state.editor_content}
        browser_content={@state.browser_content}
        index_html={@indexHTML()}
        raw_index={@rawIndex()}
        editorChange={@editorChange}/>
    </main>
