React = require 'react/addons'
Promise = require 'bluebird'
request = require 'request'

Loader = require('./loader')
Published = require('./published')

module.exports =
React.createClass
  getInitialState: ->
    {
      published: false,
    }
  componentDidMount: ->
    @props.publish().then((resp) =>
      @setState(published: true)
    ).catch (err) =>
      @props.handleError(err)
  render: ->
    if @props.files_changed
      <Loader title='Building your website...'/>
    else if @state.published
      <Published website_url={@props.website_url}/>
    else
      <Loader title='Publishing your website...'/>
