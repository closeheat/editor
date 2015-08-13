_ = require 'lodash'
request = require 'request'
Promise = require 'bluebird'

module.exports =
class Filesystem
  constructor: ->
    require('jade-memory-fs')

  files: ->
    fs.data()

  load: ->
    @addFiles()

  addFiles: ->
    @getInitialData().then (data) =>
      # check data.success
      @createDirs(data.files)

      Promise.all(@addFileContents(data.files)).then ->
        data

  createDirs: (files) ->
    files_in_dirs = _.select files, (file) ->
      file_dir_split = file.path.split('/')
      file_dir_split.length > 1

    _.each files_in_dirs, (file) ->
      file_dir_split = file.path.split('/')
      dir_path = _.initial(file_dir_split).join('/')
      fs.mkdirpSync("/#{dir_path}")

  getInitialData: ->
    new Promise (resolve, reject) =>
      request.get json: true, url: "#{window.location.origin}/apps/#{APP_SLUG}/live_edit/init", (err, status, resp) ->
        return reject(err) if err

        resolve(resp)

  addFileContents: (files) ->
    result = []

    _.each files, (file) =>
      promise = new Promise (resolve, reject) =>
        fs.writeFileSync(fs.join('/', file.path), file.content || 'not-modifiable')
        resolve()

      result.push(promise)

    result
