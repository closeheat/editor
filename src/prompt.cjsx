React = require 'react/addons'
ContentEditable = require('react-wysiwyg')

module.exports =
React.createClass
  getInitialState: ->
    {
      value: @props.element_data.element.html()
      initial_style: @initialStyle()
    }

  initialStyle: ->
    position_style = {
      position: 'absolute'
      width: @props.element_data.width
      height: @props.element_data.height
      backgroundColor: 'rgb(24, 30, 44)'
      border: 0
      outline: '3px solid white'
    }

    original_styles = _.pick JSON.parse(@props.element_data.style),
      'font',
      'padding',
      'color',
      'lineHeight',
      'textAlign',
      'textTransform',

    _.merge(original_styles, position_style)

  onChange: (new_value) ->
    @setState(value: new_value)

  style: ->
    result = @state.initial_style
    result.top = @props.element_data.top + 54 - @props.iframe_scroll_top
    result.left = @props.element_data.left - @props.iframe_scroll_left
    result

  render: ->
    <ContentEditable
      key={@props.iframe_scroll_top}
      tagName='div'
      onChange={@onChange}
      html={@state.value}
      preventStyling
      noLinebreaks
      editing=true
      style={@style()}
    />
