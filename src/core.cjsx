md = require 'marked'
$ = require 'jquery'
React = require 'react'

Router = require 'react-router'
Route = Router.Route
DefaultRoute = Router.DefaultRoute

Filesystem = require './filesystem'
App = require './app'
CodeMode = require './code_mode'
PreviewMode = require './preview_mode'
TabManager = require './tab_manager'

module.exports =
class Core
  constructor: (@base, @server) ->
    @filesystem = new Filesystem()

  load: ->
    @filesystem.load().then =>
      Router.run @routes(), (Handler) ->
        React.render(<Handler/>, document.body)

  routes: ->
    <Route handler={App} path='/' base={@base} server={@server} >
      <Route name='code' path='/code' handler={CodeMode}>
        <Route name='file' path='*?' handler={TabManager} />
        <DefaultRoute name='file-manager' handler={TabManager}/>
      </Route>
      <Route name='preview' handler={PreviewMode} />
      <DefaultRoute handler={CodeMode} />
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
