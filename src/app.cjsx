React = require 'react/addons'
jade = require 'jade-memory-fs'
_ = require 'lodash'
$ = window.jQuery = window.$ = require 'jquery'
require('./materialize')

Router = require 'react-router'
RouteHandler = Router.RouteHandler
Navigation = Router.Navigation

Header = require './header'

module.exports =
React.createClass
  getInitialState: ->
    {
      code_editor_path: ''
    }
  mixins: [Navigation],
  editorChange: (path, new_content) ->
    bug_message = 'If you see this - a bug occured. Could you send us a message by clicking Support in the top?'
    fs.writeFileSync(fs.join('/', path), new_content || bug_message)

    # @goToStep(2) if @state.loaded
    # @setState(loaded: true) if new_content == @state.editor_content

  codeClick: ->
    @transitionWithCodeModeHistory('code', '/code/*?')
  previewClick: ->
    @transitionWithCodeModeHistory('preview', 'preview-with-history')

    browser_ref = @refs.appRouteHandler.refs.__routeHandler__.refs.browser
    return unless browser_ref

    # same route, refresh manually
    browser_ref.refresh()

  transitionWithCodeModeHistory: (route, with_history_route) ->
    editor_path = @refs.appRouteHandler.refs.__routeHandler__.props.params.splat

    if editor_path
      @transitionTo(with_history_route, splat: editor_path)
    else
      @transitionTo(route)

  publishClick: ->

  render: ->
    <main>
      <Header onCodeClick={@codeClick} onPreviewClick={@previewClick} onPublishClick={@publishClick} />

      <RouteHandler
        base={@props.base}
        editorChange={@editorChange}
        onRouteChange={@routeChange}
        ref='appRouteHandler'/>
    </main>
