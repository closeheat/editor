React = require 'react/addons'
_ = require 'lodash'
InlineBrowser = require('./inline_browser')
Loader = require('./loader')
Filesystem = require('./filesystem')

module.exports =
React.createClass
  getInitialState: ->
    {
      build_finished: false,
    }
  componentDidMount: ->
    @props.build().then((resp) =>
      @setState(build_finished: true)
    ).catch (err) =>
      @props.handleError(err)
  onChange: (e) ->
    if e.data.action == 'click'
      @changeInHtml(e.data)
    else if e.data.action == 'prompt'
      @state.editing_location.element.html(e.data.new_content)
    else
      debugger

  changeInHtml: (event) ->
    locations = []

    _.each @htmlFiles(), (file) =>
      dom = $('<html>').html(file.content)
      element = dom.find(event.path)
      locations.push(file: file, element: element, dom: dom)

    return alert('Cannot edit this element') if locations.length != 1

    location = locations[0]
    @setState(editing_location: location)

    new_content_code = "prompt('', '#{location.element.html()}')"
    code = "parent.postMessage({ action: 'prompt', new_content: #{new_content_code} }, 'http://localhost:4000')"
    @refs.browser.evalInIframe(code)
  htmlFiles: ->
    _.select Filesystem.ls(), (file) ->
      file.path.match(/\.html$/)
  browser: ->
    <div>
      <div className='row'>
        <div className='col browser-col full m12'>
          <InlineBrowser ref='browser' browser_url={@props.browser_url} onChange={@onChange}/>
        </div>
      </div>
    </div>
  render: ->
    if @state.build_finished
      @browser()
    else
      <Loader title='Hang in tight. Building your page preview...'/>
