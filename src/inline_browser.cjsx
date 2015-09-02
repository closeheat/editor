React = require 'react'
window._ = require 'lodash'

inlineInject = ->
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

  bindEvent = (event) ->
    window.addEventListener event, (e) ->
      e.preventDefault()
      selector = getSelector(e.target)
      parent.postMessage(action: event, selector: selector, old_outline: e.target.outline, 'http://localhost:4000')

  events = [
    'click'
    'mouseover'
    'mouseout'
  ]

  bindEvent(event) for event in events

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
    @evalInIframe(inlineInject.toString())
  evalInIframe: (code) ->
    @iframe().contentWindow.postMessage(@wrapEvalFunction(code), 'http://localhost:9000')
  render: ->
    <div className='browser'>
      <iframe id='browser' name='browser-frame' src={'http://localhost:9000' || @props.browser_url}></iframe>
    </div>
