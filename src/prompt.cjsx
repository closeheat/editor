React = require 'react'
ReactDOM = require 'react-dom'
ContentEditable = require('react-wysiwyg')
Draggabilly = require 'draggabilly'

module.exports =
React.createClass
  getInitialState: ->
    {
      value: @originalValue(@props)
    }

  originalValue: (props) ->
    props.element_data.text

  onChange: (e) ->
    @setState(value: e.target.value)

  onApply: ->
    @props.onApply(@state.value)

  componentWillReceiveProps: (next_props) ->
    @setState
      value: @originalValue(next_props)

  componentDidMount: ->
    new Draggabilly(ReactDOM.findDOMNode(@), handle: '.prompt-header')

  isLink: ->
    @props.element_data.node.parentNode.tagName == 'A'

  type: ->
    if @isLink()
      'Link'
    else
      'Text'

  navigate: ->
    return <div/> unless @isLink()

    <div className='prompt-header-navigate' onClick={@props.onNavigate}>
      Navigate
    </div>
  render: ->
    <div className='prompt'>
      <div className='prompt-header row'>
        <div className='col s8'>
          {@type()}
        </div>
        <div className='col s4'>
          {@navigate()}
        </div>
      </div>
      <div className='prompt-content'>
        <textarea className='prompt-input' onChange={@onChange} value={@state.value}/>
      </div>

      <div className='prompt-actions row'>
        <div className='prompt-action col s6 blue-text' onClick={@onApply}>Apply</div>
        <div className='prompt-action col s6' onClick={@props.onClose}>Cancel</div>
      </div>
    </div>
