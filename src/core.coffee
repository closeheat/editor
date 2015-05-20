$ = require 'jquery'
React = require 'react'

Filesystem = require './filesystem'
# Editor = require './editor'
App = require './app'

module.exports =
class Core
  constructor: (token, username, reponame, @base, @server) ->
    @filesystem = new Filesystem(token, username, reponame)

  load: ->
    @filesystem.load().then =>
      React.render(React.createElement(App, base: @base, server: @server), document.body)

token = '6dd48ba02321d681d139bd9247066cbee6898019'
username = 'Nedomas'
reponame = 'testing-editor'
base = 'http://testing-editor.closeheatapp.com/'
username = 'closeheat'
reponame = 'web'
base = 'http://web.closeheatapp.com/'
server = 'http://localhost:3000'

$ ->
  new Core(token, username, reponame, base, server).load()
