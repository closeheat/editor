React = require 'react'
flatten = require('flat')
_ = require 'lodash'
request = require 'request'
Promise = require 'bluebird'
cookies = require 'browser-cookies'
require('./materialize')

Router = require 'react-router'
RouteHandler = Router.RouteHandler
Navigation = Router.Navigation

Header = require './header'
Filesystem = require './filesystem'
NewApp = require './new_app'
ChangeDistDirToast = require './change_dist_dir_toast'

module.exports =
React.createClass
  getInitialState: ->
    @bindKeys()
    track('loaded', ch_initial_referrer: cookies.get('ch_initial_referrer'))

    {
      clean_files: _.cloneDeep(Filesystem.ls())
      action_in_progress: false
      first_build_done: false
      show_free_hosting: false
      show_change_dist_dir: false
      # show_change_dist_dir: !@props.is_demo_app && @props.first_build
      dist_dir: @props.dist_dir
    }

  componentDidMount: ->
    @showCodeGuide() if @props.is_demo_app

  showCodeGuide: ->
    Materialize.toast("We created a simple demo website for you. Here's the code.", 10000)
    setTimeout((-> Materialize.toast("Click <span class='guide-button'>Preview</span> to see how it looks.", 10000)), 4000)

  showFreeHosting: ->
    @setState(show_free_hosting: true)

  hideFreeHosting: ->
    @setState(show_free_hosting: false, free_hosting_shown: true)

  bindKeys: ->
    $(window).bind 'keydown', (event) =>
      return unless event.ctrlKey or event.metaKey

      switch String.fromCharCode(event.which).toLowerCase()
        when 's'
          event.preventDefault()
          @previewClick()
        when 'e'
          event.preventDefault()
          @codeClick()

  mixins: [Navigation],
  editorChange: (path, new_content) ->
    Filesystem.write(path, new_content)
  codeClick: ->
    track('code_clicked')
    @transitionWithCodeModeHistory('code', '/code/*?')
  previewClick: ->
    track('preview_clicked')
    return if @state.action_in_progress

    if @context.router.getCurrentPath().match(/^\/preview/)
      @buildOrRefresh()
    else
      @transitionWithCodeModeHistory('preview', 'preview-with-history')

  visualClick: ->
    track('visual_clicked')
    return if @state.action_in_progress

    if @context.router.getCurrentPath().match(/^\/visual/)
      @buildOrRefresh()
    else
      @transitionWithCodeModeHistory('visual', 'visual-with-history')

  transitionWithCodeModeHistory: (route, with_history_route) ->
    track('transitioned_to', route: route)

    if _.isEmpty(@context.router.getCurrentParams())
      @transitionTo(route)
    else
      @transitionTo(with_history_route, @context.router.getCurrentParams())

  publishClick: ->
    track('publish_clicked')
    return if @state.action_in_progress
    @transitionWithCodeModeHistory('publish', '/publish/*?')

  settingsClick: ->
    return if @state.action_in_progress

    @openSettings()

  handleError: (msg) ->
    track('error_happened', message: msg)
    @setState(error: msg)
    @transitionWithCodeModeHistory('error', '/error/*?')

  changedFiles: ->
    _.reject Filesystem.ls(), (new_file) =>
      clean_file = _.find @state.clean_files, (file) ->
        file.path == new_file.path

      clean_file.content == new_file.content

  build: ->
    @buildOrRefresh()

  buildOrRefresh: ->
    if @filesChanged() or !@state.first_build_done
      @execBuild()
    else
      @refreshBrowser()

  refreshBrowser: ->
    new Promise (resolve, reject) =>
      browser_ref = @refs.appRouteHandler.refs.__routeHandler__?.refs.browser
      return resolve() unless browser_ref

      # same route, refresh manually
      browser_ref.refresh()
      resolve()

  execBuild: ->
    track('build_started')
    @actionStarted()

    new Promise (resolve, reject) =>
      request.post
        json: true
        body:
          files: @changedFiles()
        url: "#{window.location.origin}/apps/#{APP_SLUG}/live_edit/preview"
      , (err, status, resp) =>

        return reject(err) if err
        if status.statusCode == 500
          return reject("Something bad happened in the server. Not your fault. We're fixing it.")
        return reject(resp.error) unless resp.success

        @setState(clean_files: _.cloneDeep(Filesystem.ls()), first_build_done: true)
        @actionStopped()
        track('build_finished')
        resolve()

  filesChanged: ->
    !_.isEmpty(@changedFiles())

  publishToGithub: ->
    track('publish_started')

    if @filesChanged()
      @build().then(@publishToGithub).catch (err) =>
        @handleError(err)
    else
      @actionStarted()
      @execPublish().then( (resp) =>
        return @handleError(resp.error) unless resp.success

        track('publish_to_github_finished')
      ).catch (err) =>
        @handleError(err)

  waitForPublishToServer: ->
    new Promise (resolve, reject) =>
      pusher_user_channel.bind 'app.build', =>
        track('publish_to_server_finished')
        @actionStopped()
        resolve()

  execPublish: ->
    new Promise (resolve, reject) =>
      request.post json: true, url: "#{window.location.origin}/apps/#{APP_SLUG}/live_edit/publish", (err, status, resp) ->
        return reject(err) if err

        # published to GitHub
        resolve(resp)

  activeMode: ->
    routes = @context.router.getCurrentRoutes()

    # in this setup second route is the important route
    _.first(routes[1].name.split('-'))

  actionStarted: ->
    @setState(action_in_progress: true)

  actionStopped: ->
    @setState(action_in_progress: false)

  openSettings: ->
    track('settings_clicked')
    @transitionWithCodeModeHistory('settings', '/settings/*?')

  hideChangeDistDirToast: ->
    @setState(show_change_dist_dir: false)

  saveDistDir: (dist_dir) ->
    new Promise (resolve, reject) =>
      request.post
        json: true
        url: "#{window.location.origin}/apps/#{APP_SLUG}/live_edit/change_dist_dir"
        body:
          dist_dir: dist_dir
      , (err, status, resp) =>
        return reject(err) if err

        @setState(dist_dir: resp.dist_dir)
        resolve(resp)

  saveSlug: (slug) ->
    new Promise (resolve, reject) =>
      request.post
        json: true
        url: "#{window.location.origin}/apps/#{APP_SLUG}/live_edit/change_slug"
        body:
          slug: slug
      , (err, status, resp) =>
        return reject(err) if err
        return reject('invalid_slug') unless resp.success

        window.location.origin = @newEditorUrl(resp.slug)

  newEditorUrl: (slug) ->
    window.location.href = "#{window.location.origin}/apps/#{slug}/live_edit#{window.location.hash}"

  render: ->
    <main className='editor-wrapper'>
      <Header
        action_in_progress={@state.action_in_progress}
        website_url={@props.website_url}
        active_mode={@activeMode()}
        onCodeClick={@codeClick}
        onPreviewClick={@previewClick}
        onVisualClick={@visualClick}
        onPublishClick={@publishClick}
        onSettingsClick={@settingsClick}
        onNewWebsiteClick={@showFreeHosting}
        avatar={@props.avatar}
        />

      <RouteHandler
        browser_url={@props.browser_url}
        website_url={@props.website_url}
        slug={@props.slug}
        dist_dir={@state.dist_dir}
        editorChange={@editorChange}
        build={@build}
        handleError={@handleError}
        error={@state.error}
        transitionWithCodeModeHistory={@transitionWithCodeModeHistory}
        files_changed={@filesChanged()}
        publishToGithub={@publishToGithub}
        waitForPublishToServer={@waitForPublishToServer}
        actionStopped={@actionStopped}
        saveDistDir={@saveDistDir}
        saveSlug={@saveSlug}
        hideChangeDistDirToast={@hideChangeDistDirToast}
        ref='appRouteHandler'/>

      <NewApp show={@state.show_free_hosting} close={@hideFreeHosting}/>
      <ChangeDistDirToast
        show={@state.show_change_dist_dir}
        dist_dir={@state.dist_dir}
        onClose={@hideChangeDistDirToast}
        onClick={@openSettings}
      />
    </main>
