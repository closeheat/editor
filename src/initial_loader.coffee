_ = require 'lodash'
request = require 'request'
Promise = require 'bluebird'
Filesystem = require './filesystem'

module.exports =
class InitialLoader
  constructor: ->
    Filesystem.create()

  loadFilesAndData: ->
    @addFiles()

  addFiles: ->
    @getInitialData().then (data) =>
      # check data.success
      Filesystem.createDirs(data.files)

      Promise.all(@addFileContents(data.files)).then ->
        data

  getInitialData: ->
    new Promise (resolve, reject) =>
      request.get json: true, url: "#{window.location.origin}/apps/#{APP_SLUG}/live_edit/init", (err, status, resp) ->
        return reject(err) if err

        resolve(resp)

  addFileContents: (files) ->
    _.each files, (file) =>
      Filesystem.write(file)
