React = require 'react'
jade = require 'jade-memory-fs'
_ = require 'lodash'

Browser = require('./browser')
Editor = require('./editor')

InfoModal = React.createClass
  render: ->
    if @props.open
      return (
        <div className='modal'>
          <div className='fog'></div>
          <div className='loading'>Loading</div>
        </div>
      )
    else
      return <span/>

    # <div>
      # <div className='fog'></div>
    # </div>

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

    if step && !@props.done
      step()
    else
      <div></div>

module.exports =
App = React.createClass
  getInitialState: ->
    browser_content: @indexHTML()
    editor_content: @rawIndex()
    status: 'none'
    tour_step: 1

  noStep: ->
    @setState(tour_step: 1000)
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
    @setState(tour_step: 3) if @state.loaded
  showError: ->
    @setState(status: 'error')
  showSuccess: ->
    @setState(status: 'published')
  deploy: ->
    @setState(tour_done: true)
    $ = require('jquery')
    @setState(status: 'publishing')

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

  publishing: ->
    if @state.status == 'publishing'
      <div className='editor-modal'>
        <div className='fog'></div>
        <div className='publishing'>Publishing...</div>
      </div>

  published: ->
    if @state.status == 'published'
      <div className='editor-modal'>
        <div className='fog' onClick={@closeModal}></div>
        <div className='published'>
          <h3>Your edits are published.</h3>
          <a href={'http://' + APP_SLUG + '.closeheatapp.com'}>Open your website</a>
          <button className='back' onClick={@closeModal}>Back to editor</button>
        </div>
      </div>

  closeModal: ->
    @setState(status: 'none')

  render: ->
    <main>
      {@publishing()}
      {@published()}

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
      <Tour step={@state.tour_step} done={@state.tour_done}/>
    </main>
