$ = require 'jquery'
React = require 'react'

Filesystem = require './filesystem'
Editor = require './editor'
App = require './app'

module.exports =
class Core
  constructor: (token, username, reponame) ->
    @filesystem = new Filesystem(token, username, reponame)

  load: ->
    @filesystem.load().then ->
      React.render(React.createElement(App, null), document.body)

token = 'd188e3d18211aaec848e0a4f9066fc8d56a161f8'
username = 'Nedomas'
reponame = 'testing-editor'

$ ->
  new Core(token, username, reponame).load()
