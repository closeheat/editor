_ = require 'lodash'
request = require 'request'

module.exports =
class Filesystem
  constructor: ->
    require('jade-memory-fs')

  files: ->
    fs.data()

  load: ->
    @addFiles()

  addFiles: ->
    @getFiles().then (files) =>
      @createDirs(files)

      compatible_files = _.select files, (file) ->
        file.path.match(/\.jade|md|html$/)

      Promise.all(@addFileContents(compatible_files))

  createDirs: (files) ->
    files_in_dirs = _.select files, (file) ->
      file_dir_split = file.path.split('/')
      file_dir_split.length > 1

    _.each files_in_dirs, (file) ->
      file_dir_split = file.path.split('/')
      dir_path = _.initial(file_dir_split).join('/')
      fs.mkdirpSync("/#{dir_path}")

  getFiles: ->
    new Promise (resolve, reject) =>
      request.post url: "#{window.location.href}/files", (err, status, resp) ->
        return reject(err) if err

        files = JSON.parse(resp).editor
        resolve(files)

  addFileContents: (files) ->
    result = []

    _.each files, (file) =>
      promise = new Promise (resolve, reject) =>
        fs.writeFileSync("/#{file.path}", file.content)
        resolve()

      result.push(promise)

    result
