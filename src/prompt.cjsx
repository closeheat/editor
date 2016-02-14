React = require 'react'
ReactDOM = require 'react-dom'
ContentEditable = require('react-wysiwyg')
Draggabilly = require 'draggabilly'
autosize = require 'autosize'
deepDiff = require('deep-diff').diff

module.exports =
React.createClass
  getInitialState: ->
    @buildState(@props.element_data)

  buildState: (element_data) ->
    {
      value: @originalValue(element_data)
      attributes: @getAttributes(element_data)
    }

  originalValue: (element_data) ->
    element_data.text

  onChange: (e) ->
    @setState(value: e.target.value)

  onApply: ->
    return @showNoChanges() unless @hasChanges()

    @props.onApply(@state.value, @state.attributes)

  showNoChanges: ->
    Materialize.toast("There are no changes to apply.", 4000)

  hasChanges: ->
    old_values = @buildState(@props.element_data)
    current_values = @buildState(text: @state.value, selector_element: { attributes: @state.attributes })
    diff = deepDiff(old_values, current_values)
    diff && diff.length

  componentWillReceiveProps: (next_props) ->
    @setState
      value: @originalValue(next_props.element_data)
      attributes: @getAttributes(next_props.element_data)
    autosize(@refs.content)

  componentDidMount: ->
    new Draggabilly(ReactDOM.findDOMNode(@), handle: '.prompt-header')
    autosize(@refs.content)

  isLink: ->
    @props.element_data.node.parentNode.tagName == 'A' || @props.element_data.node.tagName == 'A'

  isNestedInALink: ->
    @props.element_data.node.parentElement.tagName == 'A' && @props.element_data.node.nodeName != '#text'

  nestedType: ->
    NAMES =
      IMG: 'Image'

    second_part = NAMES[@props.element_data.node.nodeName] || 'Element'
    "Linked #{second_part}"

  type: ->
    if @isNestedInALink()
      @nestedType()
    else if @isLink()
      'Link'
    else
      'Text'

  navigate: ->
    <div className='prompt-header-action' onClick={@props.onNavigate}>
      Navigate
    </div>
  editParentLink: ->
    <div className='prompt-extra'>
      <div className='prompt-extra-action' onClick={@props.onEditParent}>
        Edit link
      </div>
    </div>

  actions: ->
    return <div/> unless @isLink()

    <div className='prompt-header-actions'>
      {@navigate()}
    </div>

  getAttributes: (element_data) ->
    _.map @attributeArray(element_data), (attribute) ->
      _.pick(attribute, ['name', 'value'])

  attributeArray: (element_data) ->
    Array.prototype.slice.call(element_data.selector_element.attributes)

  changeAttribute: (name, new_value) ->
    result = _.cloneDeep(@state.attributes)
    attribute = _.find result, name: name
    attribute.value = new_value

    @setState
      attributes: result

  sortedAttributes: ->
    PRIORITY_ATTRIBUTES = ['href', 'value', 'src', 'placeholder']

    _.orderBy @state.attributes, (attribute) ->
      _.includes(PRIORITY_ATTRIBUTES, attribute.name)
    , 'desc'

  attributeFields: ->
    <div className='prompt-attributes'>
      {_.map @sortedAttributes(), (attribute) =>
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
  hasContent: ->
    NO_CONTENT_TAGS = ['INPUT', 'BUTTON', 'IMG']
    return false if _.includes(NO_CONTENT_TAGS, @props.element_data.node.tagName)
    return false unless @props.element_data.text

    true

  contentField: ->
    <textarea rows={1} ref='content' className='prompt-input' onChange={@onChange} value={@state.value}/>
  render: ->
    <div className='prompt'>
      <div className='prompt-header row'>
        <div className='col col-no-padding s8'>
          {@type()}
        </div>
        <div className='col col-no-padding s4'>
          {@actions()}
        </div>
      </div>
      <div className='prompt-content'>
        {@hasContent() && @contentField()}
        {!!@state.attributes.length && @attributeFields()}
        {@isNestedInALink() && @editParentLink()}
      </div>

      <div className='prompt-actions row'>
        <div className='prompt-action col s6 blue-text' onClick={@onApply}>Apply</div>
        <div className='prompt-action col s6' onClick={@props.onClose}>Cancel</div>
      </div>
    </div>
