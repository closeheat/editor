React = require 'react/addons'
flatten = require('flat')
_ = require 'lodash'
$ = window.jQuery = window.$ = require 'jquery'
request = require 'request'
Promise = require 'bluebird'
require('./materialize')

Router = require 'react-router'
RouteHandler = Router.RouteHandler
Navigation = Router.Navigation

Header = require './header'
Filesystem = require './filesystem'

module.exports =
React.createClass
  getInitialState: ->
    {
      clean_files: _.cloneDeep(Filesystem.ls())
    }
  mixins: [Navigation],
  editorChange: (path, new_content) ->
    Filesystem.write(path, new_content)

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
    @transitionWithCodeModeHistory('publish', '/publish/*?')

  changedFiles: ->
    _.reject Filesystem.ls(), (new_file) =>
      clean_file = _.detect @state.clean_files, (file) ->
        file.path == new_file.path

      clean_file.content == new_file.content

  build: ->
    new Promise (resolve, reject) =>
      request.post
        json: true
        body:
          files: @changedFiles()
        url: "#{window.location.origin}/apps/#{APP_SLUG}/live_edit/preview"
      , (err, status, resp) =>
        return reject(err) if err
        return reject(resp.error) unless resp.success

        @setState(clean_files: _.cloneDeep(Filesystem.ls()))
        resolve()

  activeMode: ->
    routes = @context.router.getCurrentRoutes()

    # in this setup second route is the important route
    _.first(routes[1].name.split('-'))

  render: ->
    <main className='editor-wrapper'>
      <Header active_mode={@activeMode()} onCodeClick={@codeClick} onPreviewClick={@previewClick} onPublishClick={@publishClick} />

      <RouteHandler
        browser_url={@props.browser_url}
        editorChange={@editorChange}
        onRouteChange={@routeChange}
        build={@build}
        ref='appRouteHandler'/>
    </main>
