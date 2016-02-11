Filesystem = require('./filesystem')
HTMLModifier = require('./html_modifier')
_ = require 'lodash'

module.exports =
class SourceModifier
  constructor: (@analysis, @new_text) ->
    @source = Filesystem.read(@analysis.file).content

  replaceAtCoords: (string, insertion, start, end) ->
    string.substr(0, start) + insertion + string.substr(end)

  modifiedFileContent: ->
    @replaceAtCoords(@source, @new_text, @analysis.position.start, @analysis.position.end)

  apply: ->
    Filesystem.write(@analysis.file, @modifiedFileContent())
    console.log @modifiedFileContent()
