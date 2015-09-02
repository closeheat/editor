React = require 'react/addons'
PublishStatus = require './publish_status'
Tour = require './tour'

_ = require 'lodash'

$ = window.jQuery = window.$ = require 'jquery'

module.exports =
Header = React.createClass
  getInitialState: ->
    # tour_step = if TOUR_FINISHED
    #   1000
    # else
    #   1
    #
    # tour_step: tour_step
    # stage: 0
    {}

  goToStep: (tour_step) ->
    # console.log(tour_step: tour_step, state: @state.tour_step)
    # return if tour_step < @state.tour_step
    #
    # @setState(tour_step: tour_step)

  activeModeClass: (type, cols) ->
    React.addons.classSet
      col: true
      'header-mode': true
      'center-align': true
      "#{cols}": true
      'header-mode-active': @props.active_mode == type
      'header-in-progress': @props.action_in_progress && type != 'code'

  componentDidMount: ->
    @addTooltips()

  componentDidUpdate: ->
    @addTooltips()

  addTooltips: ->
    elements = _.map ['code', 'preview', 'publish', 'website_url', 'avatar'], (name) =>
      React.findDOMNode(@refs[name])

    $(elements).tooltip
      delay: 100

  prettyWebsiteUrl: ->
    @props.website_url.replace('http://', '')

  render: ->
    dashboard_url = "http://app.closeheat.com/apps/#{APP_SLUG}/"

    <div>
      <div className='row header-row'>
        <div className={@activeModeClass('code', 'label-with-icon s2')} onClick={@props.onCodeClick} data-tooltip='Ctrl+E' ref='code'>
          <i className='material-icons'>code</i>
          Code
        </div>
        <div className={@activeModeClass('preview', 'label-with-icon s2 m3')} onClick={@props.onPreviewClick} data-tooltip='Ctrl+S' ref='preview'>
          <i className='material-icons'>navigation</i>
          Preview Changes
        </div>
        <div className='header-website-url col s4 m3 center-align label-with-icon' ref='website_url' data-tooltip='This is your public page URL'>
          <a href={@props.website_url} target='_blank' className='truncate'>
            {@prettyWebsiteUrl()}
            <i className='material-icons header-icon-right'>open_in_new</i>
          </a>
        </div>
        <div
          className={@activeModeClass('publish', 's2 label-with-icon')}
          onClick={@props.onPublishClick}
          data-tooltip="Publishes changes to #{@prettyWebsiteUrl()}"
          ref='publish'>

          <i className='material-icons'>publish</i>
          Publish
        </div>
        <div className='header-support col s1 center-align'>
          <a href="mailto:support@closeheat.com?subject=I'm having a problem with the editor">
            Support
          </a>
        </div>
        <div className='col s1 center-align'>
          <a href={dashboard_url} target='_blank' className='header-avatar' ref='avatar' data-tooltip='Dashboard'>
            <img src={@props.avatar}/>
          </a>
        </div>
      </div>

      <Tour step={@state.tour_step} done={@state.tour_done}/>
    </div>
