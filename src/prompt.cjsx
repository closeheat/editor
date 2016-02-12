React = require 'react'
ReactDOM = require 'react-dom'
ContentEditable = require('react-wysiwyg')
Draggabilly = require 'draggabilly'
autosize = require 'autosize'

module.exports =
React.createClass
  getInitialState: ->
    {
      value: @originalValue(@props)
      attributes: @attributes()
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
    autosize(@refs.content)

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
  attributes: ->
    _.map @attributeArray(), (attribute) ->
      _.pick(attribute, ['name', 'value'])

  attributeArray: ->
    Array.prototype.slice.call(@props.element_data.selector_element.attributes)

  changeAttribute: (name, new_value) ->
    result = _.cloneDeep(@state.attributes)
    attribute = _.find result, name: name
    attribute.value = new_value

    @setState
      attributes: result

  attributeFields: ->
    <div className='prompt-attributes'>
      {_.map @state.attributes, (attribute) =>
        dom_id = "attribute-#{attribute.name}"

        <div key={attribute.name} className='prompt-attribute'>
          <label className='prompt-attribute-label' htmlFor={dom_id}>
            {attribute.name}
          </label>
          <input
            id={dom_id}
            className='prompt-input'
            value={attribute.value}
            onChange={(e) => @changeAttribute(attribute.name, e.target.value) }
          />
        </div>
      }
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
        <textarea rows={1} ref='content' className='prompt-input' onChange={@onChange} value={@state.value}/>
        {!!@state.attributes.length && @attributeFields()}
      </div>

      <div className='prompt-actions row'>
        <div className='prompt-action col s6 blue-text' onClick={@onApply}>Apply</div>
        <div className='prompt-action col s6' onClick={@props.onClose}>Cancel</div>
      </div>
    </div>
