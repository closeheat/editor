_ = require 'lodash'

module.exports =
class FilesystemHistory
  @create: ->
    window.fs_history = []

  @write: (file) ->
    window.fs_history.push(_.cloneDeep(file))

  @last: ->
    _.last(window.fs_history)
