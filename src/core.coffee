$ = require 'jquery'
React = require 'react'

Filesystem = require './filesystem'
Editor = require './editor'
App = require './app'

module.exports =
class Core
  constructor: (token, username, reponame, @base) ->
    @filesystem = new Filesystem(token, username, reponame)

  load: ->
    @filesystem.load().then =>
      React.render(React.createElement(App, base: @base), document.body)

token = '8080149d057ce69f7b78ae2a7ade804bc4b79d65'
# username = 'Nedomas'
# reponame = 'testing-editor'
# base = 'http://testing-editor.closeheatapp.com/'
username = 'closeheat'
reponame = 'web'
base = 'http://web.closeheatapp.com/'

$ ->
  new Core(token, username, reponame, base).load()
