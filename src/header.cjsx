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

  render: ->
    edit_other_files_url = "http://app.closeheat.com/apps/#{APP_SLUG}/guide/toolkit"

    <div>
      <div className='row header-row'>
        <div className='col s12 header-cols'>
          <nav>
            <div className="nav-wrapper">
              <ul className="left">
                <li>
                  <a href="javascript:void(0)" onClick={@props.onCodeClick}><i className="mdi-image-remove-red-eye left"></i>Code</a>
                </li>
                <li>
                  <a href="javascript:void(0)" onClick={@props.onPreviewClick}><i className="mdi-content-send left"></i>Preview Changes</a>
                </li>
              </ul>
              <ul className="right">
                <li>
                  <a href="javascript:void(0)" onClick={@props.onPublishClick}><i className="mdi-content-send left"></i>Publish</a>
                </li>
                <li>
                  <a href="javascript:void(0)" onClick={@props.onPublishClick}><i className="mdi-content-send left"></i>Support</a>
                </li>
                <li>
                  <a className='header-avatar'>
                    <img src="/logo-square.png"/>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <Tour step={@state.tour_step} done={@state.tour_done}/>
    </div>
