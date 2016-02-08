React = require 'react'
_ = require 'lodash'
InlineBrowser = require('./inline_browser')
Prompt = require('./prompt')
Loader = require('./loader')
Filesystem = require('./filesystem')
require('string_score')
Parser = new DOMParser()

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
    if e.data.action == 'click'
      console.log e
      @onClick(e.data)
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
  onClick: (event) ->
    console.log('cicked')
    element_data = @editableElement(event)

    if element_data
      @setState
        show_prompt: true
        current_element_data: element_data
    else
      @removePrompt()

  removePrompt: ->
    @setState
      show_prompt: false
      current_element_data: {}

  editableElement: (event) ->
    locations = []

    window.THINGS = []
    window.Pa = Parser

    selector_parts = event.selector.split(' > ')

    _.each @htmlFiles(), (file) =>
      dom = $(Parser.parseFromString(file.content, "text/html"))

      combinations = []

      _.times selector_parts.length + 1, (i) =>
        combination = _.takeRight(selector_parts, i).join(' > ')
        element = dom.find(combination)
        return true unless element[0]

        combinations.push(combination)

      # return true unless combinations.length

      # GREY MATTER
      strongest_selector = _.last(combinations)
      selector_strength = combinations.length

      element = dom.find(strongest_selector)
      element_inner_text = element[0].innerText
      string_score = event.inner_text.score(element_inner_text)

      max_selector_scale = 12
      strength = selector_strength * 0.2 + (string_score * max_selector_scale) * 0.8

      element_data =
        file: file
        element: element[0]
        dom: dom
        selector_strength: selector_strength
        selector_combinations: combinations
        original_inner_text: event.inner_text
        element_inner_text: element_inner_text
        string_score: string_score
        strength: strength

      # window.THINGS.push(element_data)
      # console.log combinations.length
      # if combinations.length
      #   console.log combinations
      #   console.log file
      #   console.log '------'
      locations.push(_.merge(element_data, event))

    return unless locations.length

    window.EV = event
    console.log event
    strongest = _.maxBy(locations, 'strength')
    console.log _.sortBy(locations, 'strength')
    console.log 'MOST PROBABLE'
    console.log strongest.file.content
    console.log "selector: #{strongest.selector}"
    console.log "original: #{strongest.original_inner_text}"
    console.log "el: #{strongest.element_inner_text}"
    console.log "selector strength: #{strongest.selector_strength}"
    console.log "string score: #{strongest.string_score}"
    console.log "strength: #{strongest.strength}"
    console.log "file: #{strongest.file.path}"

    # if locations.length != 1
    #   window.SEL = event.selector
    #   console.log locations
    # return unless @isEditableElement(locations)
    #
    # locations[0]
  isEditableElement: (locations) ->
    return unless locations.length == 1

    element = locations[0].element
    return unless element.children().length == 0
    return unless element.html()

    true

  htmlFiles: ->
    _.filter Filesystem.ls(), (file) ->
      file.path.match(/\.html$/)

  onScroll: (data) ->
    @setState(iframe_scroll_top: data.top, iframe_scroll_left: data.left)
  onSave: (new_value) ->
    old_element_html = @state.current_element_data.element.prop('outerHTML')
    new_element_html = @state.current_element_data.element.html(new_value).prop('outerHTML')

    # DO THIS CHECK BEFORE
    found_element = @state.current_element_data.file.content.match(old_element_html)
    return alert('Cant find the element in code. Formatting?') unless found_element

    new_content = @state.current_element_data.file.content.replace(old_element_html, new_element_html)
    Filesystem.write(@state.current_element_data.file.path, new_content)
    @removePrompt()
    @rebuild()
  prompt: ->
    return <div></div> unless @state.show_prompt

    <Prompt
      element_data={@state.current_element_data}
      iframe_scroll_top={@state.iframe_scroll_top}
      iframe_scroll_left={@state.iframe_scroll_left}
      onSave={@onSave}
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
