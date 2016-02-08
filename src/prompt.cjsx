React = require 'react'
ContentEditable = require('react-wysiwyg')

module.exports =
React.createClass
  getInitialState: ->
    {
      value: @props.element_data.element.html()
      field_style: @initialStyle()
    }

  initialStyle: ->
    field_styles = {
      width: @props.element_data.width
      height: @props.element_data.height
      # backgroundColor: 'rgb(24, 30, 44)'
      # color: '#fff'
      border: 0
      # outline: '1px solid white'
    }

    original_styles = _.pick JSON.parse(@props.element_data.style),
      'color',
      'font',
      'padding',
      'lineHeight',
      'textAlign',
      'textTransform',

    _.merge(original_styles, field_styles)

  onChange: (new_value) ->
    @setState(value: new_value)

  onSave: ->
    @props.onSave(@state.value)

  positionStyle: ->
    {
      position: 'absolute'
      top: @props.element_data.top + 54 - @props.iframe_scroll_top - 20
      left: @props.element_data.left - @props.iframe_scroll_left
    }

  render: ->
    <div
      className='prompt'
      style={@positionStyle()}
      key={@props.iframe_scroll_top}>

      <div className='prompt-actions'>
        <div className='prompt-action' onClick={@onSave}>Save</div>
      </div>

      <ContentEditable
        tagName='div'
        onChange={@onChange}
        html={@state.value}
        preventStyling
        noLinebreaks
        editing=true
        style={@state.field_style}
      />
    </div>
