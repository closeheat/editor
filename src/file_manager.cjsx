React = require 'react/addons'
_ = require 'lodash'

module.exports =
React.createClass
  folderFiles: ->
    result = _.map fs.data[@props.path], (location, path) =>
      {
        type: @locationType(location),
        path: path,
      }

    _.reject result, (file) ->
      file.type == 'folder-marker'


  locationType: (location) ->
    if _.isObject(location)
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
