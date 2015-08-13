React = require 'react/addons'
_ = require 'lodash'

module.exports =
React.createClass
  folderFiles: ->
    result = _.map @filesystemObject(), (location, path) =>
      {
        type: @locationType(location),
        path: path,
      }

    _.reject result, (file) ->
      file.type == 'folder-marker'

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
            {_.map @folderFiles(), (file) ->
              <li>
                {file.type} - {file.path}
              </li>
            }
            </ul>
          </div>
        </div>
      </div>
    </div>
