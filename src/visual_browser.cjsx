React = require 'react'
window._ = require 'lodash'

visualInject = ->
  window.CLOSEHEAT_EDITOR = {}

  positionInDom = (el, count = 1) ->
    if new_el = el.previousElementSibling
      positionInDom(new_el, count + 1)
    else
      count

  getSelector = (el) ->
    names = []

    while el.parentNode
      if el.id
        names.unshift '#' + el.id
        break
      else
        if el == el.ownerDocument.documentElement
          names.unshift el.tagName.toLowerCase()
        else
          c = 1
          e = el
          while e.previousElementSibling
            e = e.previousElementSibling
            c++
          names.unshift el.tagName.toLowerCase() + ':nth-child(' + c + ')'
        el = el.parentNode

    names.join ' > '

  edit = (e) ->
    return if window.CLOSEHEAT_EDITOR.navigating

    node_text = text(e)
    return unless node_text

    e.stopPropagation()
    e.preventDefault()
    selector = getSelector(e.target)

    window.CLOSEHEAT_EDITOR.last_target = e.target
    parent.postMessage
      action: 'edit'
      selector: selector
      top: e.clientX
      left: e.clientY
      height: e.target.offsetHeight
      width: e.target.offsetWidth
      old_outline: e.target.outline
      pathname: window.location.pathname
      text: node_text
      style: JSON.stringify(window.getComputedStyle(e.target))
    , 'SERVER_URL_PLACEHOLDER'

    false

  text = (event) ->
    getTextNode(event).nodeValue

  getTextNode = (event) ->
    # fallback for links
    document.getSelection().baseNode || event.target.childNodes[0]

  onMessage = (e) ->
    if e.data.action == 'navigate'
      navigate()

  navigate = () ->
    window.CLOSEHEAT_EDITOR.navigating = true
    window.CLOSEHEAT_EDITOR.last_target.click()
    window.CLOSEHEAT_EDITOR.navigating = false

  bindEvents = ->
    window.addEventListener 'click', edit, true
    window.addEventListener('message', onMessage, false)

  getElementOffset = (element) ->
    de = document.documentElement
    box = element.getBoundingClientRect()
    top = box.top + window.pageYOffset - de.clientTop
    left = box.left + window.pageXOffset - de.clientLeft
    { top: top, left: left }

  #
  # events = [
  #   'click'
  #   'mouseover'
  #   'mouseout'
  # ]

  bindEvents()
  # bindEvent(event) for event in events
  # bindScrollEvent()
  console.log('injected her')

  # browser.on 'focus', '[contenteditable]', ->
  #   console.log('focus')
  #   @setAttribute('data-before', noContentEditable($(@)).prop('outerHTML'))
  #
  # browser.on 'blur', '[contenteditable]', ->
  #   console.log('bl')
  #   sendToEditor($(@).data('before'), noContentEditable($(@)).prop('outerHTML'))

module.exports =
React.createClass
  getInitialState: ->
    window.addEventListener('message', @props.onMessage, false)

    {}
  iframe: ->
    document.getElementById('browser')
  refresh: ->
    @iframe().src = @props.browser_url
  componentDidMount: ->
    $(@iframe()).load =>
      @inject()
  wrapEvalFunction: (code) ->
    "evalFunction = #{code}; evalFunction()"
  inject: ->
    console.log 'inkecting'
    @evalInIframe(visualInject.toString().replace(/SERVER_URL_PLACEHOLDER/g, window.SERVER_URL))
  evalInIframe: (code) ->
    @iframe().contentWindow.postMessage(@wrapEvalFunction(code), @props.browser_url)
  render: ->
    <div className='browser'>
      <iframe ref='iframe' id='browser' name='browser-frame' src={@props.browser_url}></iframe>
    </div>
