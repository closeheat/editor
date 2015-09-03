React = require 'react/addons'
_ = require 'lodash'
InlineBrowser = require('./inline_browser')
Prompt = require('./prompt')
Loader = require('./loader')
Filesystem = require('./filesystem')
Parser = new DOMParser()

editingPrompt = ->
  parent.postMessage(action: 'prompt', new_content: prompt('', 'CONTENT_VALUE'), 'http://localhost:4000')

mouseoverCode = ->
  element = document.querySelector('SELECTOR')
  element.style.outline = '1px solid #E5E5E5'

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
    @props.build().then((resp) =>
      @setState(build_finished: true)
    ).catch (err) =>
      @props.handleError(err)
  onMessage: (e) ->
    if e.data.action == 'click'
      @onClick(e.data)
    else if e.data.action == 'prompt'
      @state.editing_location.element.html(e.data.new_content)
    else if e.data.action == 'mouseover'
      @onMouseover(e.data)
    else if e.data.action == 'mouseout'
      @onMouseout(e.data)
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
  onClick: (event) ->
    element_data = @editableElement(event)

    if element_data
      @setState
        show_prompt: true
        current_element_data: element_data
    else
      @setState
        show_prompt: false
        current_element_data: {}

  editableElement: (event) ->
    locations = []

    _.each @htmlFiles(), (file) =>
      dom = $(Parser.parseFromString(file.content, "text/html"))
      element = dom.find(event.selector)
      element_data =
        file: file
        element: element
        dom: dom

      locations.push(_.merge(element_data, event))

    return unless @isEditableElement(locations)

    locations[0]
  isEditableElement: (locations) ->
    return unless locations.length == 1

    element = locations[0].element
    return unless element.children().length == 0
    return unless element.html()

    true

  htmlFiles: ->
    _.select Filesystem.ls(), (file) ->
      file.path.match(/\.html$/)

  onScroll: (data) ->
    console.log(data)
    @setState(iframe_scroll_top: data.top, iframe_scroll_left: data.left)
  prompt: ->
    return <div></div> unless @state.show_prompt

    <Prompt
      element_data={@state.current_element_data}
      iframe_scroll_top={@state.iframe_scroll_top}
      iframe_scroll_left={@state.iframe_scroll_left}
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
