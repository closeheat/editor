React = require 'react'
ReactDOM = require 'react-dom'
ContentEditable = require('react-wysiwyg')
require('jquery-ui/draggable')

module.exports =
React.createClass
  getInitialState: ->
    {
      value: @originalValue(@props)
    }

  originalValue: (props) ->
    props.element_data[props.element_data.winner_type].text

  onChange: (e) ->
    @setState(value: e.target.value)

  onApply: ->
    @props.onApply(@state.value)

  componentWillReceiveProps: (next_props) ->
    @setState
      value: @originalValue(next_props)

  componentDidMount: ->
    $(ReactDOM.findDOMNode(@)).draggable(handle: '.prompt-header')

  render: ->
    <div className='prompt'>
      <div className='prompt-header'>
        Text
      </div>
      <div className='prompt-content'>
        <textarea className='prompt-input' onChange={@onChange} value={@state.value}/>
      </div>

      <div className='prompt-actions row'>
        <div className='prompt-action col s6 blue-text' onClick={@onApply}>Apply</div>
        <div className='prompt-action col s6' onClick={@props.onClose}>Cancel</div>
      </div>
    </div>
