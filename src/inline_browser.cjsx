React = require 'react'

inlineInject = ->
  sendToEditor = (before, after) ->
    parent.closeheatInlineOnChange.inlineEdited(before, after)

  noContentEditable = (target) ->
    result = target.clone()
    result.removeAttr('contenteditable')
    result.removeAttr('data-before')
    result

  $ = parent.$
  browser = $(window.document)
  browser.find('h1').prop('contentEditable', true)
  debugger

  browser.on 'click', ->
    console.log('aa')
  browser.on 'focus', '[contenteditable]', ->
    console.log('focus')
    @setAttribute('data-before', noContentEditable($(@)).prop('outerHTML'))

  browser.on 'blur', '[contenteditable]', ->
    console.log('bl')
    sendToEditor($(@).data('before'), noContentEditable($(@)).prop('outerHTML'))

module.exports =
React.createClass
  getInitialState: ->
    window.closeheatInlineOnChange = @props.onChange
    {}
  iframe: ->
    document.getElementById('browser')
  refresh: ->
    @iframe().src = @props.browser_url
  componentDidMount: ->
    $(@iframe()).load =>
      @inject()
  inject: ->
    # b = @iframe()
    # debugger
    @iframe().contentWindow.eval("inlineInject = #{inlineInject.toString()}; inlineInject()")
  render: ->
    <div className='browser'>
      <iframe id='browser' name='browser-frame' src={'http://editor.d44ff2f8e27ece72d5034da1ea78ceb3129b5452.demo-d855.staging.closeheat.com' || @props.browser_url}></iframe>
    </div>
