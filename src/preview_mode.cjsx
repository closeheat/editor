React = require 'react'
Browser = require('./browser')
Loader = require('./loader')

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
  browser: ->
    <div>
      <div className='row full'>
        <div className='col browser-col full m12'>
          <Browser ref='browser' browser_url={@props.browser_url} />
        </div>
      </div>
    </div>
  render: ->
    if @state.build_finished
      @browser()
    else
      <Loader
        title='Hang in tight.'
        subtitle='Building your page preview...'/>
