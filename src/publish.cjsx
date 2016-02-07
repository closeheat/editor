React = require 'react'
Promise = require 'bluebird'
request = require 'request'

Loader = require('./loader')
Published = require('./published')

module.exports =
React.createClass
  getInitialState: ->
    {
      published_to_server: false,
      published_to_github: false,
    }
  componentDidMount: ->
    @props.publishToGithub().then((resp) =>
      @setState(published_to_github: true)

      @props.waitForPublishToServer().timeout(60000, @timeoutMsg()).then =>
        @setState(published_to_server: true)
    ).catch (err) =>
      @props.handleError(err)

  timeoutMsg: ->
    "Oops. Looks like we're having problems with publishing apps. <br>Click Support in the top bar!"
  render: ->
    if @props.files_changed
      <Loader title='Building your website...'/>
    else if @state.published_to_server
      <Published website_url={@props.website_url}/>
    else if @state.published_to_github
      <Loader
        title='Your files are now in Github.'
        subtitle='Publishing to server (~30 sec)...'/>
    else
      <Loader title='I am publishing your landing page...'/>
