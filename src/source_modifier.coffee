Filesystem = require('./filesystem')
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
        console.log 'front matter not imple'
      else
        console.log 'not implemented'

    Filesystem.write(@analysis.file, new_source)
    console.log new_source
