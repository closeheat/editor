Filesystem = require('./filesystem')
_ = require 'lodash'

class TextReplacer
  constructor: (@combination, @new_text, @source) ->

  replace: ->
    return @source if _.isEmpty(@combination.content_position)

    @replaceAtCoords(@source, @new_text, @combination.content_position.start,
      @combination.content_position.end)

  replaceAtCoords: (string, insertion, start, end) ->
    string.substr(0, start) + insertion + string.substr(end)

class AttributeReplacer
  constructor: (@combination, @new_attributes, @source) ->

  getAtCoords: (string, start, end) ->
    string.substr(start, end - start)

  regex: (attribute) ->
    new RegExp(new RegExp("(\\s*(?:\\s+#{attribute.name})\\s*)").source + /(=\s*")([^"]*)("\s*)/.source)

  replaceAttribute: (string, attribute) ->
    string.replace(@regex(attribute), "$1$2#{attribute.value}$4")

  replace: ->
    tag = @getAtCoords(@source, @combination.start_tag_position.start, @combination.start_tag_position.end)

    _.each @new_attributes, (attribute) =>
      tag = @replaceAttribute(tag, attribute)

    @replaceAtCoords(@source, tag, @combination.start_tag_position.start,
      @combination.start_tag_position.end)

  replaceAtCoords: (string, insertion, start, end) ->
    string.substr(0, start) + insertion + string.substr(end)

module.exports =
class SourceModifier
  constructor: (@combination, @new_text, @new_attributes) ->
    @source = Filesystem.read(@combination.file_path).content

  apply: ->
    replaced_text = new TextReplacer(@combination, @new_text, @source).replace()
    replaced_attributes = new AttributeReplacer(@combination, @new_attributes, replaced_text).replace()
    Filesystem.write(@combination.file_path, replaced_attributes)
    console.log replaced_attributes
