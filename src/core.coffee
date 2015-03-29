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

token = 'a991e9e427f251e019f662562830b54c4836d7ea'
username = 'Nedomas'
reponame = 'testing-editor'

$ ->
  new Core(token, username, reponame).load()
