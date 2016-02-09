_ = require 'lodash'
request = require 'request'
Promise = require 'bluebird'
Filesystem = require './filesystem'
FilesystemHistory = require './filesystem_history'

module.exports =
class InitialLoader
  constructor: ->

  loadFilesAndData: ->
    @addFiles()

  addFiles: ->
    @getInitialData().then((data) =>
      window.CloseheatFileSettings = {}
      FilesystemHistory.create()
      Filesystem.create(data.files)

      data
    ).catch (err) =>
      # TODO: handle error before React loads
      alert(err)

  getInitialData: ->
    new Promise (resolve, reject) =>
      request.get json: true, url: "#{window.location.origin}/apps/#{APP_SLUG}/live_edit/init", (err, status, resp) ->
        return reject(err) if err

        resolve(resp)
