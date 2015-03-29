React = require 'react'
jade = require 'jade-memory-fs'
_ = require 'lodash'

Browser = require('./browser')
Editor = require('./editor')

module.exports =
App = React.createClass
  getInitialState: ->
    browser_content: @indexHTML()
    editor_content: @rawIndex()
  indexHTML: ->
    jade.renderFile('/index.jade')
  rawIndex: ->
    fs.readFileSync('/index.jade').toString()
  update: ->
    fs.writeFileSync('/index.jade', @state.editor_content)
    @setState(browser_content: @indexHTML())
    # @refs.browser.forceUpdate()
  editorChange: (new_content) ->
    @setState(editor_content: new_content)
  render: ->
    <div>
      <Browser content={@state.browser_content} ref='browser' />
      <Editor value={@state.editor_content} onChange={@editorChange} />
      <button onClick={@update}>Save</button>
    </div>
