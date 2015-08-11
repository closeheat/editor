React = require 'react'
ContentEditable = require('react-wysiwyg')
window.$ = require 'jquery'

inlineEditingInject = ->
  sendToEditor = (before, after) ->
    parent.CloseheatAppComponentInstance.inlineEdited(before, after)

  noContentEditable = (target) ->
    result = target.clone()
    result.removeAttr('contenteditable')
    result.removeAttr('data-before')
    result

  $ = parent.$
  browser = $(window.document)
  browser.find('h1').prop('contentEditable', true)
  debugger

  browser.on 'focus', '[contenteditable]', ->
    console.log('focus')
    @setAttribute('data-before', noContentEditable($(@)).prop('outerHTML'))

  browser.on 'blur', '[contenteditable]', ->
    console.log('bl')
    sendToEditor($(@).data('before'), noContentEditable($(@)).prop('outerHTML'))

module.exports =
Browser = React.createClass
  getInitialState: ->
    window.CloseheatAppComponentInstance = @props.app

    {}
  code: (content) ->
    result = content.replace('<head>', "<head><base href='#{@props.base}'>")
    result.replace('</body>', "<script type='text/javascript'>inlineEditing = #{inlineEditingInject.toString()}; inlineEditing()</script></body>")
  refresh: (content) ->
    doc = document.getElementById('browser').contentWindow.document
    doc.open()
    doc.write(@code(content))
    doc.close()
  componentDidMount: ->
    @refresh(@props.initial_content)
  render: ->
    <div className='browser'>
      <iframe id='browser' name='browser-frame'></iframe>
    </div>
