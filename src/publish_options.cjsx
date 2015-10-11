React = require 'react/addons'
Promise = require 'bluebird'
request = require 'request'

module.exports =
React.createClass
  getInitialState: ->
    commit_msg: ''
  changeCommitMsg: (e) ->

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
            <label htmlFor='commit-msg' className='active'>
              Change comment (commit message)
            </label>
          </div>

          <div className='branch-options'>
            <div>
              <input type='radio' id='branch-master' />
              <label htmlFor='branch-master'>
                Deploy to website (master branch)
              </label>
            </div>
            <div>
              <input type='radio' id='branch-pr' />
              <label htmlFor='branch-pr'>
                Create a Pull Request with changes (create new branch)
              </label>
            </div>

            <div className='input-field'>
              <input id='dist-dir' type='text'/>
              <label htmlFor='dist-dir' className='active'>
                Title for a Pull Request
              </label>
            </div>
          </div>

          <div className="btn btn-large waves-effect waves-light settings-save-changes-button">
            Publish
          </div>

        </div>
      </div>
    </div>
