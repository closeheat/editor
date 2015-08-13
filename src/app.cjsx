React = require 'react/addons'
jade = require 'jade-memory-fs'
# glob = require 'glob'
# walk    = require('walk')
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

module.exports =
React.createClass
  getInitialState: ->
    {
      clean_files: @serializedFiles()
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
    @setState(clean_files: @serializedFiles())

    browser_ref = @refs.appRouteHandler.refs.__routeHandler__.refs.browser
    return unless browser_ref

    # same route, refresh manually
    browser_ref.refresh()

  serializedFiles: ->
    result = flatten(fs.data, { delimiter: '/' })
    result = _.omit result, (content, path) ->
      content == true

    _.map result, (content, path) ->
      {
        path: path,
        content: content.toString(),
      }

  transitionWithCodeModeHistory: (route, with_history_route) ->
    editor_path = @refs.appRouteHandler.refs.__routeHandler__.props.params.splat

    if editor_path
      @transitionTo(with_history_route, splat: editor_path)
    else
      @transitionTo(route)

  publishClick: ->
    @transitionWithCodeModeHistory('publish', '/publish/*?')

  changedFiles: ->
    _.reject @serializedFiles(), (new_file) =>
      clean_file = _.detect @state.clean_files, (file) ->
        file.path == new_file.path

      clean_file.content == new_file.content

  build: ->
    new Promise (resolve, reject) =>
      $.ajax(
        dataType: 'json'
        method: 'POST'
        data: { files: @changedFiles() }
        url: "#{window.location.origin}/apps/#{APP_SLUG}/live_edit/preview"
      ).then((resp) ->
        return reject(resp.error) unless resp.success

        resolve()
      ).fail (err) ->
        reject(err)

  render: ->
    <main>
      <Header onCodeClick={@codeClick} onPreviewClick={@previewClick} onPublishClick={@publishClick} />

      <RouteHandler
        browser_url={@props.browser_url}
        editorChange={@editorChange}
        onRouteChange={@routeChange}
        build={@build}
        ref='appRouteHandler'/>
    </main>
