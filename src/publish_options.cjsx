React = require 'react/addons'
Promise = require 'bluebird'
request = require 'request'

BranchOptions = require './branch_options'

module.exports =
React.createClass
  getInitialState: ->
    commit_msg: ''
    branch: 'master'
    title: ''
  componentDidMount: ->
    track('publish_options')
  check: (type) ->
    @setState(branch: type)
  titleChange: (new_title) ->
    @setState(title: new_title)
  changeCommitMsg: (e) ->
    @setState(commit_msg: e.target.value)

  continue: ->
    @props.onContinue(@state)
  render: ->
    <div className='publish-options settings'>
      <div className='row'>
        <div className='settings-container col s12 offset-m2 m8 offset-l3 l6'>
          <div className='row'>
            <div className='settings-title'>
              Publish changes
            </div>
          </div>

          <div className='input-field'>
            <input
              id='commit-msg'
              type='text'
              value={@state.commit_msg}
              onChange={@changeCommitMsg}
            />

            <label htmlFor='commit-msg'>
              Comment
            </label>
          </div>

          <BranchOptions
            branch={@state.branch}
            onCheck={@check}
            title={@state.title}
            onTitleChange={@titleChange} />

          <div onClick={@continue} className="btn btn-large waves-effect waves-light settings-save-changes-button">
            Continue
          </div>

        </div>
      </div>
    </div>
