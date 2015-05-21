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

module.exports =
App = React.createClass
  getInitialState: ->
    browser_content: @indexHTML()
    editor_content: @rawIndex()
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
  showError: ->
    @setState(modal_open: true)
  showSuccess: ->
    @setState(modal_title: 'Successfully deployed!')
  closeModal: ->
    @setState(modal_open: false)
  deploy: ->
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
    ).then(@showSuccess).fail(@showError)

  editorChange: (new_content) ->
    @setState(editor_content: new_content)
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

    </main>
