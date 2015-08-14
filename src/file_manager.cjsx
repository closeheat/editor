React = require 'react/addons'
_ = require 'lodash'

Router = require 'react-router'
Link = Router.Link

module.exports =
React.createClass
  folderFiles: ->
    result = _.map @filesystemObject(), (parent_data, filename) =>
      {
        type: @locationType(parent_data),
        name: filename,
      }

    result = _.reject result, (file) ->
      file.type == 'folder-marker'

    _.map result, (file) =>
      file.href = @fileOrDirHref(file.type, file.name)
      file

  fileOrDirHref: (type, filename) ->
    path = fs.join(@props.path || '', filename).replace(/^\//, '')

    @props.reuseTabHref(path)

  filesystemObject: ->
    fs.data[@props.path] || fs.data

  locationType: (location) ->
    if _.isPlainObject(location)
      'folder'
    else if location == true
      # "": true inside all folders for some reason
      'folder-marker'
    else
      'file'

  render: ->
    <div>
      <div className='row'>
        <div className='col editor-col full m12'>
          <div className='editor'>
            <ul>
            {_.map @folderFiles(), (file) =>
              <li>
                <Link to='file' params={{ splat: file.href }}>
                  {file.type} - {file.name}
                </Link>
              </li>
            }
            </ul>
          </div>
        </div>
      </div>
    </div>
