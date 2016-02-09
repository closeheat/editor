React = require 'react'
_ = require 'lodash'
InlineBrowser = require('./inline_browser')
Prompt = require('./prompt')
Loader = require('./loader')
Filesystem = require('./filesystem')
SourceFinder = require('./source_finder')

editingPrompt = ->
  parent.postMessage(action: 'prompt', new_content: prompt('', 'CONTENT_VALUE'), 'http://localhost:4000')

mouseoverCode = ->
  element = document.querySelector('SELECTOR')
  element.style.outline = '1px solid hsla(225, 7%, 55%, .4)'

mouseoutCode = ->
  element = document.querySelector('SELECTOR')
  element.style.outline = ''

module.exports =
React.createClass
  getInitialState: ->
    {
      build_finished: false
      show_prompt: false
      iframe_scroll_top: 0
      iframe_scroll_left: 0
      current_element_data: {}
    }
  componentDidMount: ->
    @build()
  build: ->
    @props.build().then((resp) =>
      @setState(build_finished: true)
    ).catch (err) =>
      @props.handleError(err)


  rebuild: ->
    @setState(build_finished: false)
    @build()
  onMessage: (e) ->
    if e.data.action == 'edit'
      @onEdit(e.data)
    else if e.data.action == 'prompt'
      @state.editing_location.element.html(e.data.new_content)
    else if e.data.action == 'mouseover'
      # @onMouseover(e.data)
    else if e.data.action == 'mouseout'
      # @onMouseout(e.data)
    else if e.data.action == 'scroll'
      @onScroll(e.data)
    else
      debugger

  onMouseover: (event) ->
    element_data = @editableElement(event)
    return unless element_data

    @setState(old_outline: event.old_outline)
    code = mouseoverCode.toString().replace('SELECTOR', element_data.selector)
    @refs.browser.evalInIframe(code)
  onMouseout: (event) ->
    element_data = @editableElement(event)
    return unless element_data

    code = mouseoutCode.toString().replace('SELECTOR', element_data.selector)
    @refs.browser.evalInIframe(code)
  onEdit: (event) ->
    element_data = @editableElement(event)

    @setState
      show_prompt: true
      current_element_data: element_data
    # if element_data
    #   @setState
    #     show_prompt: true
    #     current_element_data: element_data
    # else
    #   @removePrompt()

  removePrompt: ->
    @setState
      show_prompt: false
      current_element_data: {}

  editableElement: (event) ->
    locations = []

    final = new SourceFinder(event, @editableFiles()).source()
    console.log final
    final

  isEditableElement: (locations) ->
    return unless locations.length == 1

    element = locations[0].element
    return unless element.children().length == 0
    return unless element.html()

    true

  editableFiles: ->
    _.filter Filesystem.ls(), 'editable'

  onScroll: (data) ->
    @setState(iframe_scroll_top: data.top, iframe_scroll_left: data.left)

  currentElementDataFile: ->
  onApply: (new_text) ->
    old_text = @state.current_element_data[@state.current_element_data.winner_type].text

    source = Filesystem.read(@state.current_element_data.file).content
    found_element = source.match(old_text)
    return alert('Cant find the element in code. Formatting?') unless found_element
    # make sure its once only one
    # or match on exact line (use some vdom, attach line/col numbers)

    new_source = source.replace(old_text, new_text)
    console.log new_source
    # Filesystem.write(@state.current_element_data.file, new_source)

    # console.log Filesystem.read(state.current_element_data.file)
    @removePrompt()
    # @rebuild()
  prompt: ->
    return <div></div> unless @state.show_prompt

    <Prompt
      element_data={@state.current_element_data}
      iframe_scroll_top={@state.iframe_scroll_top}
      iframe_scroll_left={@state.iframe_scroll_left}
      onApply={@onApply}
      onClose={@removePrompt}
    />
  browser: ->
    <div>
      <div className='row'>
        <div className='col browser-col full m12'>
          <InlineBrowser ref='browser' browser_url={'http://localhost:9000' || @props.browser_url} onMessage={@onMessage}/>
        </div>
      </div>
      {@prompt()}
    </div>
  render: ->
    if @state.build_finished
      @browser()
    else
      <Loader title='Hang in tight. Building your page preview...'/>
