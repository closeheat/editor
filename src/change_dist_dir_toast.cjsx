React = require 'react'
_ = require 'lodash'

module.exports =
React.createClass
  distDirName: ->
    return 'Root (/)' if @props.dist_dir == '/' or _.isEmpty(@props.dist_dir)

    @props.dist_dir
  render: ->
    return <div></div> unless @props.show

    <div className='toast-container'>
      <div className='toast custom-toast'>
        <span>
          Current public directory for this website is <b>{@distDirName()}</b>
        </span>
        <span className='custom-toast-buttons'>
          <span className='btn-flat yellow-text' onClick={@props.onClick}>
            Change public directory
          </span>
          <span className='btn-flat blue-text text-lighten-4' onClick={@props.onClose}>
            Leave as is
          </span>
        </span>
      </div>
    </div>
