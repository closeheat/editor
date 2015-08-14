_ = require 'lodash'
traverse = require 'traverse'

module.exports =
class Filesystem
  @create: ->
    window.fs = {}

  @createDirs: (files) ->
    files_in_dirs = _.select files, (file) ->
      file_dir_split = file.path.split('/')
      file_dir_split.length > 1

    _.each files_in_dirs, (file) =>
      file_dir_split = file.path.split('/')
      dir_path = _.initial(file_dir_split).join('/')

      @createDir(dir_path)

  @createDir: (dir_path) ->
    fs[dir_path] = {} unless fs[dir_path]

  @write: (file) ->
    dir = @readDir(file.path)
    dir[@filename(file.path)] = file

  @readDir: (path) ->
    return fs if @dirnameKey(path) == ''

    _.get(fs, @dirnameKey(path))

  @filename: (path) ->
    path_parts = path.split('/')
    _.last(path_parts)

  @dirnameKey: (path) ->
    path_parts = path.split('/')
    path_parts.slice(0, -1).join('.')

  @ls: ->
    result = []

    traverse(fs).map (node) ->
      result.push(node) if _.isString(node.path)

  # serializedFiles: ->
  #   debugger
  #   result = flatten(fs.data, { delimiter: '/' })
  #   result = _.omit result, (content, path) ->
  #     content == true
  #
  #   _.map result, (content, path) ->
  #     {
  #       path: path,
  #       content: content.toString(),
  #     }
