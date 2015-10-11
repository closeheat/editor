React = require 'react/addons'
Promise = require 'bluebird'
request = require 'request'

Loader = require('./loader')
Published = require('./published')
PublishOptions = require('./publish_options')

module.exports =
React.createClass
  getInitialState: ->
    publishing: false
    published_to_server: false
    published_to_github: false
  componentDidMount: ->
    @props.ensureBuilt()
  publish: (data) ->
    @setState(publishing: true)

    @props.publishToGithub(data).then((resp) =>
      @setState(published_to_github: true, url: resp.website_url)

      @props.waitForPublishToServer().timeout(40000, @timeoutMsg()).then =>
        @setState(published_to_server: true)
    ).catch (err) =>
      @props.handleError(err)

  timeoutMsg: ->
    "Oops. Looks like we're having problems with publishing apps. <br>Click Support in the top bar!"
  render: ->
    if @props.files_changed
      <Loader title='Building your website first...'/>
    else if @state.published_to_server
      <Published website_url={@state.website_url}/>
    else if @state.published_to_github
      <Loader
        title='Your files are now in Github.'
        subtitle='Publishing to server...'/>
    else if @state.publishing
      <Loader title='I am publishing your landing page...'/>
    else
      <PublishOptions onContinue={@publish}/>
