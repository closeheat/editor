React = require 'react'

Router = require 'react-router'
Navigation = Router.Navigation

module.exports =
React.createClass
  mixins: [Navigation],
  activeClass: ->
    result = 'tab col m2'
    result += ' tab-active' if @props.active
    result
  onClick: ->
    return if @uneditableFile()

    @transitionTo('file', splat: @props.file.href)
  kind: ->
    return 'Folder' if @props.file.type == 'dir'

    ext = @props.file.path.match(/\.([0-9a-z]+)$/i)[1]
    @props.supported_modes[ext] || ext
  icon: ->
    if @props.file.type == 'dir'
      <i className='material-icons'>folder_open</i>
    else
      <i className='material-icons'>class</i>

  uneditableFile: ->
    @props.file.type == 'file' && !@props.file.editable

  editableClass: ->
    'file-list-uneditable' if @uneditableFile()

  render: ->
    <tr onClick={@onClick} className={@editableClass()}>
      <td className='file-list-icon'>
        {@icon()}
      </td>
      <td className='file-list-name'>
        {@props.file.name}
      </td>
      <td className='file-list-kind'>
        {@kind()}
      </td>
    </tr>
