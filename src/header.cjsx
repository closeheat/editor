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

  publishingModal: ->
    <div id="publishing-modal" className="modal">
      {@publishingContent()}
      {@publishedFooter()}
    </div>

  publishingContent: ->
    return unless @state.stage > 0

    stages = ['Publish to GitHub', 'Publish to server']

    <div className="modal-content">
      <h4>Publishing</h4>
      <p>
        <PublishStatus stages={stages} current={@state.stage} />
      </p>
      {@published()}
    </div>

  published: ->
    return unless @state.stage == 3

    <p>
      <span className="green-text">Your changes were succesfully published.</span>
    </p>

  publishedFooter: ->
    return unless @state.stage == 3

    <div className='modal-footer'>
      <a className="modal-action waves-effect waves-light btn green" href={'http://' + APP_SLUG + '.closeheatapp.com'}>Take a look at my changes</a>
      <button style={{marginRight: '10px'}} className='modal-action waves-effect waves-light btn blue' onClick={@closeModal}>Back to editor</button>
    </div>

  openModal: ->
    return if @state.modalOpened

    @setState(modalOpened: true)
    $('#publishing-modal').openModal()

  closeModal: ->
    @setState(stage: 0)
    @setState(modalOpened: false)
    $('#publishing-modal').closeModal()

  componentDidUpdate: (_prev_props, prev_state) ->
    return if @state.stage == prev_state.stage

    if @state.stage > 0
      @openModal()
    else
      @closeModal()


  goToStep: (tour_step) ->
    # console.log(tour_step: tour_step, state: @state.tour_step)
    # return if tour_step < @state.tour_step
    #
    # @setState(tour_step: tour_step)

  update: ->
    fs.writeFileSync(@props.index_filename, @props.editor_content)
    @refs.browser.refresh(@props.index_html)
    @goToStep(3) if @state.loaded

    @trackEverything('browser_editor/preview')

  deploy: ->
    @trackEverything('browser_editor/publish')
    @setState(tour_done: true, stage: 1)

    $.ajax(
      url: "#{SERVER_URL}/apps/#{APP_SLUG}/live_deploy"
      method: 'POST'
      dataType: 'json'
      data:
        username: @props.username
        reponame: @props.reponame
        code: @props.raw_index
        index_filename: @props.index_filename
    ).then(@showSuccess).fail(@showError)

    pusher_user_channel.bind 'app.build', =>
      @setState(stage: 3)

  showError: (e) ->
    @setState(publish_error: e)
  showSuccess: ->
    @setState(stage: 2)

    _.delay =>
      @setState(stage: 3)
    , 9000
  trackEverything: (part_url) ->
    $.ajax(
      url: "#{SERVER_URL}/track/#{part_url}"
      method: 'POST'
      dataType: 'json'
      data:
        app_slug: APP_SLUG
        editor_content: @state.editor_content
    )

  slideEditor: ->
    $('.editor-col').toggleClass('disabled')
    $('.browser-col').toggleClass('active')
    $('.tour-code-editor').toggleClass('hide')

    @trackEverything('browser_editor/slide')

  render: ->
    edit_other_files_url = "http://app.closeheat.com/apps/#{APP_SLUG}/guide/toolkit"

    <div>
      <div className='row'>
        <div className='col editor-col full m5'>
          <nav>
            <div className="nav-wrapper">
              <ul className="left">
                <li>
                  <a href="javascript:void(0)" onClick={@update}><i className="mdi-image-remove-red-eye left"></i>Preview</a>
                </li>
                <li>
                  <a href="javascript:void(0)" onClick={@deploy}><i className="mdi-content-send left"></i>Publish</a>
                </li>
                <li>
                  <a href={edit_other_files_url} onClick={=> @trackEverything('browser_editor/edit_other')} target='_blank'><i className="mdi-action-view-module left"></i>Edit other files</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className='col browser-col full m7'>
          <nav>
            <div className="nav-wrapper">

              <a href={edit_other_files_url} onClick={=> @trackEverything('browser_editor/click_logo')} target='_blank' className="right brand-logo">
                <img src="/logo-square.png"/>
              </a>
              <ul className="left">
                <li>
                  <a href="javascript:void(0)" onClick={@slideEditor} ><i className="mdi-navigation-menu left"></i></a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <Tour step={@state.tour_step} done={@state.tour_done}/>
      {@publishingModal()}
    </div>
