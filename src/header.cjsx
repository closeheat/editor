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
    @addDropdowns()

  componentDidUpdate: ->
    @addTooltips()
    @addDropdowns()

  addDropdowns: ->
    $(@getDOMNode()).find('.dropdown-button').dropdown(hover: true, belowOrigin: true, gutter: 20, constrain_width: false)

  addTooltips: ->
    elements = _.map ['code', 'preview', 'publish', 'website_url'], (name) =>
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
        <div className={@activeModeClass('preview', 'label-with-icon s2')} onClick={@props.onPreviewClick} data-tooltip='Ctrl+S' ref='preview'>
          <i className='material-icons'>navigation</i>
          Preview
        </div>
        <div className='header-website-url col s4 center-align label-with-icon' ref='website_url' data-tooltip='This is your public page URL'>
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
        <div className='col s1 center-align dropdown-button' data-activates='avatar-dropdown'>
          <div className='header-avatar'>
            <img src={@props.avatar}/>
          </div>
        </div>
      </div>

      <ul id='avatar-dropdown' className='dropdown-content'>
        <li>
          <a href='javascript:void(0);' onClick={@props.onSettingsClick}>
            Settings
          </a>
        </li>
        <li>
          <a href='javascript:void(0);' onClick={@props.onNewWebsiteClick}>
            Create a New Website
          </a>
        </li>
        <li>
          <a href={dashboard_url} target='_blank'>
            Website Dashboard
          </a>
        </li>
      </ul>

      <Tour step={@state.tour_step} done={@state.tour_done}/>
    </div>
