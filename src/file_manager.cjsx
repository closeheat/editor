React = require 'react/addons'
_ = require 'lodash'

Router = require 'react-router'
Link = Router.Link
Filesystem = require './filesystem'

module.exports =
React.createClass
  folderFiles: ->
    _.map @props.dir.files, (file) =>
      file.href = @props.reuseTabHref(file.path)
      file.name = file.path
      file

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
