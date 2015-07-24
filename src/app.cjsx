React = require 'react/addons'
jade = require 'jade-memory-fs'
_ = require 'lodash'

$ = window.jQuery = window.$ = require 'jquery'
require('./materialize')

Browser = require('./browser')
Editor = require('./editor')

PublishStatus = React.createClass
  currentStage: ->
    @props.current || 0
  error: (i) ->
    return <span/> unless @props.error && @currentStage() == i + 1

    <div className='stage-error'>
      App name {@props.error}
    </div>
  render: ->
    return <span className='deploy-steps'/> if @currentStage() == 0

    cx = React.addons.classSet

    <ul className="deploy-steps collection">
      {_.map @props.stages, (stage, i) =>
        li_classes = (_this) =>
          cx
            'collection-item': true
            success: !_this.props.error && _this.currentStage() > i + 1
            failure: _this.props.error && _this.currentStage() == i + 1

        icon_classes = (_this) =>
          cx
            fa: true
            icon: true
            'secondary-content': true
            'fa-check-circle': !_this.props.error && _this.currentStage() > i + 1
            'fa-circle-o-notch fa-spin': !_this.props.error && _this.currentStage() == i + 1
            'fa-exclamation-circle': _this.props.error && _this.currentStage() == i + 1

        <li className={li_classes(@)}>
          <span className='stage-name'>{stage}</span>
          <i className={icon_classes(@)}></i>
          {@error(i)}
        </li>
      }
    </ul>


Tour = React.createClass
  step1: ->
    <div className='closeheat-tour-code-editor'>
      Change "NAME" to your actual name for the magic to happen
    </div>
  step2: ->
    <div className='closeheat-tour-preview-button'>
      Click "Preview" to see your changes
    </div>
  step3: ->
    <div className='closeheat-tour-deploy-button'>
      Click "Publish" to make your changes available to public
    </div>
  render: ->
    step = @['step' + @props.step]

    if step && !@props.done
      step()
    else
      <div></div>

module.exports =
App = React.createClass
  getInitialState: ->
    tour_step = if TOUR_FINISHED
      1000
    else
      1

    browser_content: @indexHTML()
    editor_content: @rawIndex()
    tour_step: tour_step
    stage: 0

  noStep: ->
    @setState(tour_step: 1000)
  goToStep: (tour_step) ->
    console.log(tour_step: tour_step, state: @state.tour_step)
    return if tour_step < @state.tour_step

    @setState(tour_step: tour_step)
  indexFilename: ->
    try
      fs.readFileSync('/index.jade')
      return '/index.jade'
    catch e
      '/index.html'
  indexHTML: ->
    return @rawIndex() if @indexFilename() == '/index.html'

    md = require('marked')
    jade.filters.md = md
    jade.renderFile(@indexFilename())
  rawIndex: ->
    fs.readFileSync(@indexFilename()).toString()
  update: ->
    fs.writeFileSync(@indexFilename(), @state.editor_content)
    @refs.browser.refresh(@indexHTML())
    @goToStep(3) if @state.loaded

    @trackEverything('browser_editor/preview')
  showError: (e) ->
    @setState(publish_error: e)
  showSuccess: ->
    @setState(stage: 2)

    _.delay =>
      @setState(stage: 3)
    , 9000
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
        code: @rawIndex()
        index_filename: @indexFilename()
    ).then(@showSuccess).fail(@showError)

    pusher_user_channel.bind 'app.build', =>
      @setState(stage: 3)

  editorChange: (new_content) ->
    @setState(editor_content: new_content)

    @goToStep(2) if @state.loaded
    @setState(loaded: true) if new_content == @state.editor_content

  slideEditor: ->
    $('.editor-col').toggleClass('disabled')
    $('.browser-col').toggleClass('active')
    $('.tour-code-editor').toggleClass('hide')

    @trackEverything('browser_editor/slide')
  trackEverything: (part_url) ->
    $.ajax(
      url: "#{SERVER_URL}/track/#{part_url}"
      method: 'POST'
      dataType: 'json'
      data:
        app_slug: APP_SLUG
        editor_content: @state.editor_content
    )
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
      <button style={{marginRight: '10px'}}className='modal-action waves-effect waves-light btn blue' onClick={@closeModal}>Back to editor</button>
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

  render: ->
    edit_other_files_url = "http://app.closeheat.com/apps/#{APP_SLUG}/guide/toolkit"

    <main>
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
          <div className='editor'>
            <Editor value={@state.editor_content} onChange={@editorChange} index_filename={@indexFilename()} />
          </div>
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
          <Browser initial_content={@state.browser_content} base={@props.base} ref='browser' />
        </div>
      </div>
      <Tour step={@state.tour_step} done={@state.tour_done}/>
      {@publishingModal()}
    </main>
