React = require 'react/addons'
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
    a=Filesystem
    debugger
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
