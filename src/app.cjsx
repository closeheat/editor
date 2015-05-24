React = require 'react'
jade = require 'jade-memory-fs'
_ = require 'lodash'
ReactBootstrap = require 'react-bootstrap'

Modal = ReactBootstrap.Modal
Button = ReactBootstrap.Button
OverlayMixin = ReactBootstrap.OverlayMixin

Browser = require('./browser')
Editor = require('./editor')

InfoModal = React.createClass
  mixins: [OverlayMixin]
  render: ->
    <span/>
  renderOverlay: ->
    return <span/> if !@props.open

    <Modal bsStyle='primary' title={@props.title} onRequestHide={@props.close}>
      <div className='modal-footer'>
        <Button onClick={@props.close}>Close</Button>
      </div>
    </Modal>

Tour = React.createClass
  step1: ->
    <div className='tooltip-left tour-code-editor'>
      Change the code here
    </div>
  step2: ->
    <div className='tooltip-left tour-preview-button'>
      Click "Preview" to see your changes in the browser
    </div>
  step3: ->
    <div className='tooltip-left tour-deploy-button'>
      Click "Publish" to make your changes available to website visitors
    </div>
  render: ->
    step = @['step' + @props.step]
    step && step()

module.exports =
App = React.createClass
  getInitialState: ->
    browser_content: @indexHTML()
    editor_content: @rawIndex()
    tour_step: 1
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
    @setState(tour_step: 3)
  showError: ->
    @setState(modal_open: true)
  showSuccess: ->
    @setState(modal_title: 'Successfully deployed!')
  closeModal: ->
    @setState(modal_open: false)
  deploy: ->
    @setState(tour_step: 4)
    $ = require('jquery')
    @setState(modal_open: true, modal_title: 'Take a deep breath...')

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

  editorChange: (new_content) ->
    @setState(editor_content: new_content)

    @setState(tour_step: 2) if @state.loaded
    @setState(loaded: true) if new_content == @state.editor_content

  render: ->
    <main>
      <InfoModal open={@state.modal_open} title={@state.modal_title} close={@closeModal} />
      <div className='row'>
        <div className='col-md-5'>
          <div className='editor'>
            <Editor value={@state.editor_content} onChange={@editorChange} index_filename={@indexFilename()} />
          </div>
          <div className='actions'>
            <button onClick={@update} className='preview'>Preview</button>
            <button onClick={@deploy} className='publish'>Publish</button>
          </div>
        </div>
        <div className='col-md-7'>
          <Browser initial_content={@state.browser_content} base={@props.base} ref='browser' />
        </div>
      </div>
      <Tour step={@state.tour_step} />
    </main>
