md = require 'marked'
$ = require 'jquery'
React = require 'react'

Filesystem = require './filesystem'
App = require './app'

module.exports =
class Core
  constructor: (@base, @server) ->
    @filesystem = new Filesystem()

  load: ->
    @filesystem.load().then =>
      React.render(React.createElement(App, base: @base, server: @server), document.body)

$ ->
  new Core(APP_DOMAIN).load()
