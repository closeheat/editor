React = require 'react/addons'
Promise = require 'bluebird'
request = require 'request'

Loader = require('./loader')
Published = require('./published')

module.exports =
React.createClass
  getInitialState: ->
    {
      published: false
    }
  componentWillMount: ->
    @execSequence(@props)
  componentWillReceiveProps: (new_props) ->
    @execSequence(new_props)
  execSequence: (props) ->
    if props.files_changed
      props.build().catch (err) =>
        @props.handleError(err)
    else
      @execPublish().then( (resp) =>
        return @props.handleError(resp.error) unless resp.success

        @setState(published: true)
      ).catch (err) =>
        @props.handleError(err)

  execPublish: ->
    new Promise (resolve, reject) =>
      request.post json: true, url: "#{window.location.origin}/apps/#{APP_SLUG}/live_edit/publish", (err, status, resp) ->
        return reject(err) if err

        resolve(resp)
  render: ->
    if @props.files_changed
      <Loader title='Building your website...'/>
    else if @state.published
      <Published website_url={@props.website_url}/>
    else
      <Loader title='Publishing your website...'/>
