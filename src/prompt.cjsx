React = require 'react'
ContentEditable = require('react-wysiwyg')

module.exports =
React.createClass
  getInitialState: ->
    {
      value: @props.element_data[@props.element_data.winner_type].text
    }

  onChange: (new_value) ->
    @setState(value: new_value)

  onApply: ->
    @props.onApply(@state.value)

  render: ->
    console.log 'renderin'
    console.log @state.value
    <div className='prompt'>
      <ContentEditable
        tagName='div'
        onChange={@onChange}
        html={@state.value}
        preventStyling
        noLinebreaks
        editing=true
      />

      <div className='prompt-actions'>
        <span className='prompt-action' onClick={@onApply}>Apply</span>
        <span className='prompt-action' onClick={@props.onClose}>X</span>
      </div>
    </div>
