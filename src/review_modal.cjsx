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
    return @noDiff() unless @diff().length

    <pre className='review-modal-code'>
      {_.map @diff(), (line, i) =>
        <div key={i} className={@lineClass(line)}>
          {line.value}
        </div>
      }
    </pre>

  componentDidUpdate: ->
    el = $(ReactDOM.findDOMNode(@))

    if @props.show
      el.openModal()
      el.find('.modal-content').scrollTo('.review-diff-line-added, .review-diff-line-removed')
    else
      el.closeModal()

  render: ->
    return <noscript/> unless @props.show

    <div id="modal1" className="modal modal-fixed-footer review-modal">
      <div className="modal-content">
        {@lines()}
      </div>
      <div className="modal-footer">
        <span className='review-modal-file-path'>
          {@props.file_path}
        </span>

        <button onClick={@props.onUndo} className="modal-action modal-close waves-effect red-text waves-red btn-flat ">Undo changes</button>
        <button onClick={@props.onClose} className="modal-action modal-close waves-effect green-text waves-green btn-flat ">Looks good</button>
      </div>
    </div>
