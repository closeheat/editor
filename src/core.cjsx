md = require 'marked'
$ = require 'jquery'
React = require 'react'
ReactDOM = require 'react-dom'

Router = require 'react-router'
Route = Router.Route
Redirect = Router.Redirect

InitialLoader = require './initial_loader'
App = require './app'
CodeMode = require './code_mode'
PreviewMode = require './preview_mode'
TabManager = require './tab_manager'
Publish = require './publish'
ErrorHandler = require './error_handler'
InlineMode = require './inline_mode'
Settings = require './settings'

module.exports =
class Core
  constructor: (@base, @server) ->
    @initial_loader = new InitialLoader()

  load: ->
    @initial_loader.loadFilesAndData().then (data) =>
      @data = data

      Router.run @routes(), (Handler) =>
        ReactDOM.render(<Handler
          website_url={@data.app_domain}
          slug={@data.slug}
          avatar={@data.avatar}
          browser_url={@data.browser_url}
          dist_dir={@data.dist_dir}
          is_demo_app={@data.is_demo_app}
          first_build={@data.first_build}
        />, document.getElementById('editor-container'))

  routes: ->
    <Route handler={App} path='/'>
      <Route name='code' path='/code' handler={CodeMode}>
        <Route name='file' path='/code/*?' handler={TabManager} />
      </Route>

      <Route name='preview' path='/preview' handler={PreviewMode} />
      <Route name='preview-with-history' path='/preview/*?' handler={PreviewMode} />

      <Route name='inline' path='/inline' handler={InlineMode} />
      <Route name='inline-with-history' path='/inline/*?' handler={InlineMode} />

      <Route name='publish' path='/publish' handler={Publish} />
      <Route name='publish-with-history' path='/publish/*?' handler={Publish} />

      <Route name='error' path='/error' handler={ErrorHandler} />
      <Route name='error-with-history' path='/error/*?' handler={ErrorHandler} />

      <Route name='settings' path='/settings' handler={Settings} />
      <Route name='settings-with-history' path='/settings/*?' handler={Settings} />

      <Redirect from='' to='/code/' />
      <Redirect from="/code" to="/code/" />
    </Route>
    # <DefaultRoute handler={Home} />
    # <Route name="about" handler={About} />
    # <Route name="users" handler={Users}>
    #   <Route name="recent-users" path="recent" handler={RecentUsers} />
    #   <Route name="user" path="/user/:userId" handler={User} />
    #   <NotFoundRoute handler={UserRouteNotFound}/>
    # </Route>
    # <NotFoundRoute handler={NotFound}/>
    # <Redirect from="company" to="about" />

$ ->
  new Core(APP_DOMAIN).load()
