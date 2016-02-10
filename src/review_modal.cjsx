_ = require 'lodash'
React = require 'react'
ReactDOM = require 'react-dom'
jsdiff = require 'diff'
classNames = require 'classnames'
Filesystem = require('./filesystem')
FilesystemHistory = require('./filesystem_history')

module.exports =
React.createClass
  diff: ->
    jsdiff.diffLines(
      FilesystemHistory.last().content,
      Filesystem.read(@props.file_path).content
    )
  lineClass: (line) ->
    classNames
      'review-diff-line': true
      'review-diff-line-added': line.added
      'review-diff-line-removed': line.removed

  noDiff: ->
    <div className='review-no-diff'>
      There we're no differences. Weird.
    </div>
  lines: ->
    return @noDiff() unless @diff.length

    _.map @diff(), (line, i) =>
      <div key={i} className={@lineClass(line)}>
        {line.value}
      </div>

  componentDidUpdate: ->
    el = $(ReactDOM.findDOMNode(@))

    if @props.show
      el.openModal()
    else
      el.closeModal()

  render: ->
    return <noscript/> unless @props.show
        # {@lines()}

    <div id="modal1" className="modal modal-fixed-footer">
      <div className="modal-content">
      </div>
      <div className="modal-footer">
        <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat ">Agree</a>
      </div>
    </div>
