_ = require 'lodash'

module.exports =
class HTMLModifier
  constructor: (@analysis, @source, @new_text) ->
    @element = @analysis.html.element
    # count \r\n too (as 2 chars)
    @all_source_lines = @source.split('\n')

  emptySourceLineCountBeforeTarget: ->
    _.countBy(@all_source_lines[..@element.lineNumber], _.isEmpty).true

  lineNumber: ->
    @element.lineNumber + @emptySourceLineCountBeforeTarget()

  flatStartColumnNumber: ->
    line_length_before = _.sumBy @all_source_lines[0...(@lineNumber() - 1)], (line) ->
      line.length

    newline_char_before_length_sum = @lineNumber() - 1

    line_length_before + newline_char_before_length_sum + @element.columnNumber

  flatEndColumnNumber: ->
    @flatStartColumnNumber() + @analysis.text.length

  replaceAtCoords: (string, insertion, start, end) ->
    string.substr(0, start) + insertion + string.substr(end)

  target: ->
    @source.substr(@flatStartColumnNumber(), @analysis.text.length)

  ensureTargetTextMatches: ->
    unless @target() == @analysis.text
      # maybe fallback to regular match?
      console.log 'NO MATCH'
      console.log @target()
      console.log @analysis.text

  targetCoords: ->
    [@flatStartColumnNumber(), @flatEndColumnNumber()]

  modifiedSource: ->
    @ensureTargetTextMatches()
    @replaceAtCoords(@source, @new_text, @targetCoords()...)
