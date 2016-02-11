_ = require 'lodash'

module.exports =
class HTMLModifier
  constructor: (@analysis, @source, @new_text) ->
    @element = @analysis.html.element
    NEWLINE_REGEX = /(?:\r\n?|\n)/gi

    @newlines_data = []
    while (matches = NEWLINE_REGEX.exec(@source)) && matches != null
      @newlines_data.push
        index: matches.index
        last_index: NEWLINE_REGEX.lastIndex
        after_line_number: @newlines_data.length + 1

    @all_source_lines = @source.split(NEWLINE_REGEX)

  emptySourceLineCountBeforeTarget: ->
    _.countBy(@all_source_lines[0...(@element.lineNumber - 1)], _.isEmpty).true || 0

  lineNumber: ->
    @element.lineNumber + @emptySourceLineCountBeforeTarget()

  flatStartColumnNumber: ->
    line_length_before = _.sumBy @all_source_lines[0...(@lineNumber() - 1)], (line) ->
      line.length

    line_length_before + @newlineCharBeforeSum() + @element.columnNumber

  newlineCharBeforeSum: ->
    newline_seperators_before = _.filter @newlines_data, (newline_seperator) =>
      newline_seperator.after_line_number < @lineNumber()

    _.sumBy newline_seperators_before, (newline_seperator) ->
      newline_seperator.last_index - newline_seperator.index

  flatEndColumnNumber: ->
    @flatStartColumnNumber() + @analysis.text.length

  target: ->
    @source.substr(@flatStartColumnNumber(), @analysis.text.length)

  ensureTargetTextMatches: ->
    unless @target() == @analysis.text
      # maybe fallback to regular match?
      console.log @target()
      console.log @analysis.text
      throw new Error('NO MATCH ^^^^')

  targetCoords: ->
    {
      flat_start_column_number: @flatStartColumnNumber()
      flat_end_column_number: @flatEndColumnNumber()
    }

  modifiedSource: ->
    @ensureTargetTextMatches()
    @targetCoords()
