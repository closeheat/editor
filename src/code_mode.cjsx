React = require 'react/addons'

Editor = require('./editor')

module.exports =
CodeMode = React.createClass
  render: ->
    <div>
      <div className='row'>
        <div className='col editor-col full m12'>
          <div className='editor'>
            <Editor value={@props.editor_content} onChange={@props.editorChange} index_filename={@props.index_filename} />
          </div>
        </div>
      </div>
    </div>
