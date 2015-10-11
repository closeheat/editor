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
  check: (type) ->
    @setState(branch: type)
  titleChange: (new_title) ->
    @setState(title: new_title)
  changeCommitMsg: (e) ->

  publish: ->
    debugger

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
            <textarea className='materialize-textarea' id='commit-msg' type='text' value={@state.commit_msg} onChange={@changeCommitMsg}/>
            <label htmlFor='commit-msg'>
              Change comment (commit message)
            </label>
          </div>

          <BranchOptions
            branch={@state.branch}
            onCheck={@check}
            title={@state.title}
            onTitleChange={@titleChange} />

          <div onClick={@publish} className="btn btn-large waves-effect waves-light settings-save-changes-button">
            Continue
          </div>

        </div>
      </div>
    </div>
