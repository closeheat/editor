React = require 'react'

module.exports =
React.createClass
  render: ->
    <div className='toast-container'>
      <div className='toast custom-toast'>
        <span>
          Sweet! Just updated {@props.file_path}
        </span>
        <span className='custom-toast-buttons'>
          <span className='btn-flat yellow-text' onClick={@props.onReview}>
            Review
          </span>
          <span className='btn-flat red-text text-lighten-4' onClick={@props.onUndo}>
            Undo
          </span>
          <span className='btn-flat blue-text text-lighten-4' onClick={@props.onClose}>
            Dismiss
          </span>
        </span>
      </div>
    </div>
