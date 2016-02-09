_ = require 'lodash'
FilesystemHistory = require './filesystem_history'

module.exports =
class Filesystem
  @create: (files) ->
    window.fs = files

  @ls: (path) ->
    return window.fs unless path

    _.filter window.fs, (file) ->
      file.path.match(///^#{path}///)

  @read: (path) ->
    file_on_path = _.find @ls(), (file) ->
      file.path == path

    return file_on_path if file_on_path

    {
      type: 'dir',
      path: path,
      files: @dirFiles(path)
    }

  @dirFiles: (path) ->
    result = []

    _.each @ls(path), (file) ->
      relative_to_dir = file.path.replace(///^#{path}\////, '')
      name = _.first(relative_to_dir.split('/'))

      if relative_to_dir.match('/')
        dir_path = if _.isEmpty(path)
          name
        else
          [path, name].join('/')

        result.push
          type: 'dir'
          path: dir_path
          name: name
      else
        result.push(_.merge(file, type: 'file', name: name))

    _.uniqBy result, 'name'

  @write: (path, new_content) ->
    file = @read(path)
    FilesystemHistory.write(file)
    file.content = new_content

  @isFile: (path) ->
    _.find @ls(), (file) ->
      file.path == path

  # traverse = require 'traverse'
  # @createDirs: (files) ->
  #   files_in_dirs = _.filter files, (file) ->
  #     file_dir_split = file.path.split('/')
  #     file_dir_split.length > 1
  #
  #   _.each files_in_dirs, (file) =>
  #     file_dir_split = file.path.split('/')
  #     dir_path = _.initial(file_dir_split).join('/')
  #
  #     @createDir(dir_path)

  # @createDir: (dir_path) ->
  #   fs[dir_path] = {} unless fs[dir_path]

  # @write: (file) ->
  #   dir = @readDir(file.path)
  #   dir[@filename(file.path)] = file
  #
  # @readDir: (path) ->
  #   return fs if @dirnameKey(path) == ''
  #
  #   _.get(fs, @dirnameKey(path))
  #
  # @filename: (path) ->
  #   path_parts = path.split('/')
  #   _.last(path_parts)

  # @dirnameKey: (path) ->
  #   path_parts = path.split('/')
  #   path_parts.slice(0, -1).join('.')
