React = require 'react'
window._ = require 'lodash'

inlineInject = ->
  window.addEventListener 'click', (e) ->
    path = []

    el = e.target

    loop
      class_name = if el.className
        '.' + el.className
      else
        ''
      path.unshift(el.nodeName.toLowerCase() + class_name)
      break unless (el.nodeName.toLowerCase() != 'html') && (el = el.parentNode)

    parent.postMessage(action: 'click', path: path.join(' > ').replace('html > body ', ''), 'http://localhost:4000')

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
    window.addEventListener('message', @props.onChange, false)

    {}
  iframe: ->
    document.getElementById('browser')
  refresh: ->
    @iframe().src = @props.browser_url
  componentDidMount: ->
    $(@iframe()).load =>
      @inject()
  injectCode: ->
    "inlineInject = #{inlineInject.toString()}; inlineInject()"
  inject: ->
    @evalInIframe(@injectCode())
  evalInIframe: (code) ->
    @iframe().contentWindow.postMessage(code, 'http://localhost:9000')
  render: ->
    <div className='browser'>
      <iframe id='browser' name='browser-frame' src={'http://localhost:9000' || @props.browser_url}></iframe>
    </div>
