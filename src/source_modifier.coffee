Filesystem = require('./filesystem')
HTMLModifier = require('./html_modifier')
_ = require 'lodash'

module.exports =
class SourceModifier
  constructor: (@analysis, @new_text) ->
    @source = Filesystem.read(@analysis.file).content

  apply: ->
    new_source = switch @analysis.winner_type
      when 'html'
        new HTMLModifier(@analysis, @source, @new_text).modifiedSource()
      when 'front_matter'
        console.log 'FRONT MATTER NOT IMPLEMENTED YET'
      else
        console.log 'NOT IMPLEMENTED'

    Filesystem.write(@analysis.file, new_source)
    console.log new_source
