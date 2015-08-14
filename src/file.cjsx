React = require 'react/addons'

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
    @transitionTo('file', splat: @props.file.href)
  kind: ->
    return 'Folder' if @props.file.type == 'dir'

    @props.file.path.match(/\.([0-9a-z]+)$/i)[1]
  icon: ->
    if @props.file.type == 'dir'
      <i className='material-icons'>folder_open</i>
    else
      <i className='material-icons'>class</i>

  render: ->
    <tr onClick={@onClick}>
      <td className='file-list-icon'>
        {@icon()}
      </td>
      <td>
        {@props.file.name}
      </td>
      <td className='file-list-kind'>
        {@kind()}
      </td>
    </tr>
