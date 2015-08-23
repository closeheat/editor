React = require 'react'
window._ = require 'lodash'

inlineInject = ->
  positionInDom = (el) ->
    return 1 unless el.previousElementSibling

  getSelector = (el) ->
    selector = []

    loop
      class_name = if el.className
        classes = el.className.split(' ')
        '.' + classes.join('.')
      else
        ''
      selector.unshift(el.nodeName.toLowerCase() + class_name + ":nth-child(#{positionInDom(el)})")
      break unless (el.nodeName.toLowerCase() != 'html') && (el = el.parentNode)

    selector.join(' > ').replace('html > body > ', '').replace('html > body', '')

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
