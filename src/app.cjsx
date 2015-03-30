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
    @refs.browser.refresh(@indexHTML())
  deploy: ->
    $ = require('jquery')

    $.ajax
      url: "#{@props.server}/api/v1/editor/deploy"
      method: 'POST'
      dataType: 'json'
      data:
        username: @props.username
        reponame: @props.reponame
        code: @rawIndex()
    , (err, resp) ->
      debugger
  editorChange: (new_content) ->
    @setState(editor_content: new_content)
  render: ->
    <div className='container'>
      <div className='row'>
        <Browser initial_content={@state.browser_content} base={@props.base} ref='browser' />
        <Editor value={@state.editor_content} onChange={@editorChange} />
        <button onClick={@update}>Build</button>
        <button onClick={@deploy}>Deploy</button>
      </div>
    </div>
