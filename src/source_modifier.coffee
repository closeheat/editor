Filesystem = require('./filesystem')
_ = require 'lodash'

module.exports =
class SourceModifier
  constructor: (@combination, @new_text) ->
    @source = Filesystem.read(@combination.file_path).content

  replaceAtCoords: (string, insertion, start, end) ->
    string.substr(0, start) + insertion + string.substr(end)

  modifiedFileContent: ->
    @replaceAtCoords(@source, @new_text, @combination.position.start, @combination.position.end)

  apply: ->
    Filesystem.write(@combination.file_path, @modifiedFileContent())
    console.log @modifiedFileContent()
