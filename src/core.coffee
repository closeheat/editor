md = require 'marked'
$ = require 'jquery'
React = require 'react'

Filesystem = require './filesystem'
App = require './app'

module.exports =
class Core
  constructor: (token, username, reponame, @base, @server) ->
    @filesystem = new Filesystem(token, username, reponame)

  load: ->
    @filesystem.load().then =>
      React.render(React.createElement(App, base: @base, server: @server), document.body)

$ ->
  new Core(GITHUB_TOKEN, GITHUB_NAME, GITHUB_REPO, APP_DOMAIN).load()
