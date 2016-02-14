React = require 'react'
window._ = require 'lodash'

visualInject = ->
  window.CLOSEHEAT_EDITOR = {}
  NO_CONTENT_TAGS = ['INPUT', 'BUTTON', 'IMG']

  positionInDom = (el, count = 1) ->
    if new_el = el.previousElementSibling
      positionInDom(new_el, count + 1)
    else
      count

  getSelector = (node, fallback_target) ->
    if node.nodeName == '#text'
      calculateSelector(fallback_target)
    else
      calculateSelector(node)

  calculateSelector = (el) ->
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

    node = getNode(e)
    return unless isEditable(node)

    e.stopPropagation()
    e.preventDefault()
    selector = getSelector(node, e.target)

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
      text: node.nodeValue
      scrollY: window.scrollY
      scrollX: window.scrollX
      url: window.location.href
    , 'SERVER_URL_PLACEHOLDER'

    false

  isEditable = (node) ->
    return true if inTagWhitelist(node)
    return true if node.nodeValue

    false

  inTagWhitelist = (node) ->
    NO_CONTENT_TAGS.indexOf(node.tagName) != -1

  getNode = (event) ->
    nodeFromPoint(event.clientX, event.clientY)

  editableNodeTypes = ->
    NO_CONTENT_TAGS.concat('#text')

  nodeFromPoint = (x, y) ->
    el = document.elementFromPoint(x, y)
    nodes = el.childNodes

    i = 0
    while n = nodes[i++]
      if editableNodeTypes().indexOf(n.nodeName)
        r = document.createRange()
        r.selectNode n
        rects = r.getClientRects()

        j = 0
        while rect = rects[j++]
          if x > rect.left and x < rect.right and y > rect.top and y < rect.bottom
            return n
    el

  # getTextNode = (event) ->
  #
  #   # fallback for links
  #   debugger
  #   document.getSelection().baseNode || event.target.childNodes[0]

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

  scrollToRecentPosition = ->
    scroll_x = SCROLL_X_PLACEHOLDER
    scroll_y = SCROLL_Y_PLACEHOLDER
    return unless scroll_x > 0 || scroll_y > 0

    window.scrollTo(scroll_x, scroll_y)

  #
  # events = [
  #   'click'
  #   'mouseover'
  #   'mouseout'
  # ]

  bindEvents()
  scrollToRecentPosition()
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

  shouldComponentUpdate: (next_props, next_state) ->
    # dont rerender cause it causes iframe to refresh
    false
  wrapEvalFunction: (code) ->
    "evalFunction = #{code}; evalFunction()"
  injectionCode: ->
    visualInject.toString()
      .replace(/SERVER_URL_PLACEHOLDER/g, window.EDITOR_URL)
      .replace(/SCROLL_X_PLACEHOLDER/g, @props.scroll_x)
      .replace(/SCROLL_Y_PLACEHOLDER/g, @props.scroll_y)
  inject: ->
    console.log 'inkecting'
    @evalInIframe(@injectionCode())
  evalInIframe: (code) ->
    @iframe().contentWindow.postMessage(@wrapEvalFunction(code), @props.browser_url)
  render: ->
    <div className='browser'>
      <iframe ref='iframe' id='browser' name='browser-frame' src={@props.browser_url}></iframe>
    </div>
