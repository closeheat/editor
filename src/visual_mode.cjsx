React = require 'react'
_ = require 'lodash'
jsdiff = require 'diff'
VisualBrowser = require('./visual_browser')
Prompt = require('./prompt')
Loader = require('./loader')
Filesystem = require('./filesystem')
FilesystemHistory = require('./filesystem_history')
SourceFinder = require('./source_finder')
SourceModifier = require('./source_modifier')
AfterApplyToast = require('./after_apply_toast')
ReviewModal = require('./review_modal')
NodeLocationExtender = require('./node_location_extender')

module.exports =
React.createClass
  getInitialState: ->
    {
      build_finished: false
      show_prompt: false
      show_review: false
      show_after_apply_toast: false
      scroll_x: 0
      scroll_y: 0
      current_element_data: {}
      last_element_data: {}
      browser_url: @props.browser_url
    }
  componentDidMount: ->
    Materialize.toast("Click on any text or image to edit it.", 8000)
    @build()

  build: ->
    @props.build().then((resp) =>
      @setState(build_finished: true)
    ).catch (err) =>
      @props.handleError(err)

  rebuild: ->
    @setState(build_finished: false)
    @build()
  onMessage: (e) ->
    if e.data.action == 'edit'
      @onEdit(e.data)
  cantEdit: (event) ->
    track 'cant_autoedit', _.omit(event, 'action')
    Materialize.toast("Element not editable. But we logged that you wanted to and we'll improve it.", 4000)

    @setState
      show_prompt: false
      current_element_data: {}
  onEdit: (event) ->
    element_data = @editableElement(event)
    return @cantEdit(event) if _.isEmpty(element_data)

    @setState
      show_prompt: true
      show_after_apply_toast: false
      current_element_data: element_data
      last_element_data: {}
      browser_url: event.url
      scroll_x: event.scrollX
      scroll_y: event.scrollY

  removePrompt: ->
    @setState
      show_prompt: false

  editableElement: (event) ->
    final = new SourceFinder(event, @editableFiles()).source()
    console.log final
    final

  isEditableElement: (locations) ->
    return unless locations.length == 1

    element = locations[0].element
    return unless element.children().length == 0
    return unless element.html()

    true

  editableFiles: ->
    _.filter Filesystem.ls(), 'editable'

  onScroll: (data) ->
    @setState(iframe_scroll_top: data.top, iframe_scroll_left: data.left)

  onApply: (new_text, new_attributes) ->
    new SourceModifier(@state.current_element_data, new_text, new_attributes).apply()

    @setState
      current_element_data: {}
      last_element_data: @state.current_element_data
      show_after_apply_toast: true

    @removePrompt()
    @rebuild()

  onEditParent: ->
    new_element_data = @elementDataFromNode(@state.current_element_data.node.parentNode)

    @setState
      current_element_data: new_element_data

  elementDataFromNode: (node) ->
    data =
      node: node
      type: 'html'
      selector_element: node
      text: node.nodeValue
      file_path: @state.current_element_data.file_path

    new NodeLocationExtender(data).extend()

  onNavigate: ->
    @refs.browser.refs.iframe.contentWindow.postMessage
      action: 'navigate'
    , '*'

    @setState
      scroll_x: 0
      scroll_y: 0
    @removePrompt()

  removeAfterApplyToast: ->
    @setState
      show_after_apply_toast: false

  reviewApplied: ->
    console.log 'review'

    @setState
      show_review: true
      show_after_apply_toast: false

  undoApplied: ->
    @trackUndo()
    last_change = FilesystemHistory.last()
    Filesystem.write(last_change.path, last_change.content)
    @rebuild()

    @setState
      show_review: false
      show_after_apply_toast: false

  trackUndo: ->
    last_change = FilesystemHistory.last()
    diff = jsdiff.diffLines(
      last_change.content,
      Filesystem.read(last_change.path).content
    )

    track 'undo', diff: diff, element_data: @serializeElementData(@state.last_element_data)

  serializeElementData: (element_data) ->
    _.omit(element_data, 'dom', 'node', 'selector_element')

  afterApplyToast: ->
    return <div></div> unless @state.show_after_apply_toast

    <AfterApplyToast
      file_path={@state.last_element_data.file_path}
      onUndo={@undoApplied}
      onReview={@reviewApplied}
      onClose={@removeAfterApplyToast}
    />
  hideReview: ->
    @setState
      show_review: false
  browser: ->
    <div>
      <ReviewModal
        show={@state.show_review}
        onUndo={@undoApplied}
        onClose={@hideReview}
        file_path={@state.last_element_data.file_path}
      />
      <div className='row'>
        <div className='col browser-col full m12'>
          <VisualBrowser
            ref='browser'
            browser_url={@state.browser_url}
            onMessage={@onMessage}
            scroll_x={@state.scroll_x}
            scroll_y={@state.scroll_y}
          />
        </div>
      </div>
      {@state.show_prompt && <Prompt
        element_data={@state.current_element_data}
        onApply={@onApply}
        onClose={@removePrompt}
        onNavigate={@onNavigate}
        onEditParent={@onEditParent}
      />}
      {@afterApplyToast()}
    </div>
  render: ->
    if @state.build_finished
      @browser()
    else
      <Loader title='Hang in tight. Building your page...'/>
