Filesystem = require('./filesystem')
_ = require 'lodash'
StringAlter = require 'string-alter'

module.exports =
class SourceModifier
  constructor: (@analysis, @new_text) ->
    @source = Filesystem.read(@analysis.file).content

  apply: ->
    switch @analysis.winner_type
      when 'html'
        new HTMLModifier(@analysis, @source, @new_text).apply()
      when 'front_matter'
        console.log 'fm'
      else
        console.log 'not implemented'

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
      console.log 'NO MATCH'
      console.log @target()
      console.log @analysis.text

  targetCoords: ->
    [@flatStartColumnNumber(), @flatEndColumnNumber()]

  apply: ->
    @ensureTargetTextMatches()

    new_source = @replaceAtCoords(@source, @new_text, @targetCoords()...)
    console.log new_source
    # debugger
    # source_line = all_source_lines[adjusted_line_number]
    #
    # # ensure match is there
    # new_line = source_line
    # new_line[@state.current_element_data.html.element.columnNumber..@state.current_element_data.html.text.length] = new_text
    # all_source_lines[adjusted_line_number] = new_line
    #
    # new_source = all_source_lines.join('/n')
    #
    # old_text = @state.current_element_data[@state.current_element_data.winner_type].text
    # found_element = source.match(old_text)
    # return alert('Cant find the element in code. Formatting?') unless found_element
    # # make sure its once only one
    # # or match on exact line (use some vdom, attach line/col numbers)
    #
    # new_source = source.replace(old_text, new_text)
    # console.log new_source
    # Filesystem.write(@state.current_element_data.file, new_source)
