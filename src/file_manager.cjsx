React = require 'react/addons'
_ = require 'lodash'

Router = require 'react-router'
Link = Router.Link
Filesystem = require './filesystem'
File = require './file'
FileUp = require './file_up'

module.exports =
React.createClass
  folderFiles: ->
    _.map @props.dir.files, (file) =>
      file.href = @props.reuseTabHref(file.path)
      file.name = file.path
      file

  upHref: ->
    up_path = _.dropRight(@pathParts())
    @props.reuseTabHref(up_path)
  pathParts: ->
    @props.path.split('/')
  render: ->
    <div>
      <div className='row'>
        <div className='col m12'>
          <ul className='file-list-path'>
            <li className='file-list-start'>Files</li>

            {_.map @pathParts(), (part) ->
              <li>
                <span className='file-list-sep'>/</span>
                <span className='file-list-name'>{part}</span>
              </li>
            }
          </ul>

          <table className='file-list'>
            <tbody>
              <tr>
                <th colSpan=2>Name</th>
                <th>Kind</th>
              </tr>
              <FileUp show={!!@props.path} href={@upHref()}/>
              {_.map @folderFiles(), (file) =>
                <File file={file} active={@props.active} />
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
