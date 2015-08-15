md = require 'marked'
$ = require 'jquery'
React = require 'react'

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

module.exports =
class Core
  constructor: (@base, @server) ->
    @initial_loader = new InitialLoader()

  load: ->
    @initial_loader.loadFilesAndData().then (data) =>
      @data = data

      Router.run @routes(), (Handler) =>
        React.render(<Handler website_url={@data.app_domain} avatar={@data.avatar} browser_url={@data.browser_url} />, document.body)

  routes: ->
    <Route handler={App} path='/'>
      <Route name='code' path='/code' handler={CodeMode}>
        <Route name='file' path='/code/*?' handler={TabManager} />
      </Route>

      <Route name='preview' path='/preview' handler={PreviewMode} />
      <Route name='preview-with-history' path='/preview/*?' handler={PreviewMode} />

      <Route name='publish' path='/publish' handler={Publish} />
      <Route name='publish-with-history' path='/publish/*?' handler={Publish} />

      <Route name='error' path='/error' handler={ErrorHandler} />
      <Route name='error-with-history' path='/error/*?' handler={ErrorHandler} />

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
