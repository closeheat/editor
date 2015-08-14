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


  # deploy: ->
  #   @trackEverything('browser_editor/publish')
  #   @setState(tour_done: true, stage: 1)
  #
  #   $.ajax(
  #     url: "#{SERVER_URL}/apps/#{APP_SLUG}/live_deploy"
  #     method: 'POST'
  #     dataType: 'json'
  #     data:
  #       username: @props.username
  #       reponame: @props.reponame
  #       code: @props.raw_index
  #       index_filename: @props.index_filename
  #   ).then(@showSuccess).fail(@showError)
  #
  #   pusher_user_channel.bind 'app.build', =>
  #     @setState(stage: 3)

  # trackEverything: (part_url) ->
  #   $.ajax(
  #     url: "#{SERVER_URL}/track/#{part_url}"
  #     method: 'POST'
  #     dataType: 'json'
  #     data:
  #       app_slug: APP_SLUG
  #       editor_content: @state.editor_content
  #   )

  activeModeClass: (type, cols) ->
    base = "col #{cols} header-mode center-align"
    return base unless @props.active_mode == type

    base + ' header-mode-active'
  render: ->
    edit_other_files_url = "http://app.closeheat.com/apps/#{APP_SLUG}/guide/toolkit"

    <div>
      <div className='row header-row'>
        <div className='header-modes'>
          <div className={@activeModeClass('code', 's2')} onClick={@props.onCodeClick}>
            <i className='material-icons'>code</i>
            Code
          </div>
          <div className={@activeModeClass('preview', 's2')} onClick={@props.onPreviewClick}>
            <i className='material-icons'>navigation</i>
            Preview Changes
          </div>
        </div>
        <div className={@activeModeClass('publish', 'offset-s5 s1')} onClick={@props.onPublishClick}>
          <i className='material-icons'>navigation</i>
          Publish
        </div>
        <div className='col s1 header-mode center-align' onClick={@props.onPublishClick}>
          <i className='material-icons'>navigation</i>
          Support
        </div>
        <div className='col s1 header-mode center-align' onClick={@props.onPublishClick}>
          <a className='header-avatar'>
            <img src="/logo-square.png"/>
          </a>
        </div>
      </div>

      <Tour step={@state.tour_step} done={@state.tour_done}/>
    </div>
