_ = require 'lodash'
Github = require('github-api')

module.exports =
class Filesystem
  constructor: (@token, @username, @reponame) ->
    require('jade-memory-fs')

  files: ->
    fs.data()

  load: ->
    @addGithub()

  github: ->
    new Github
      token: @token
      auth: 'oauth'

  addGithub: ->
    @getGithub().then (objs) =>
      dirs = _.select objs, (file) -> file.type == 'tree'
      _.each dirs, (dir) -> fs.mkdirpSync("/#{dir.path}")

      files = _.select objs, (obj) ->
        obj.path.match(/\.jade|md|html$/) && obj.type == 'blob'

      Promise.all(@addFileContents(files))

  getGithub: ->
    new Promise (resolve, reject) =>
      @repo().getTree 'master?recursive=true', (err, contents) ->
        return reject(err) if err

        resolve(contents)

  repo: ->
    @github().getRepo(@username, @reponame)

  addFileContents: (files) ->
    result = []

    _.each files, (file) =>
      promise = new Promise (resolve, reject) =>
        @repo().read 'master', file.path, (err, contents) =>
          return reject(err) if err

          fs.writeFileSync("/#{file.path}", contents)
          resolve()

      result.push(promise)

    result
