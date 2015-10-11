React = require 'react/addons'

module.exports =
React.createClass
  checked: (type) ->
    type == @props.branch
  check: (type) ->
    (e) =>
      @props.onCheck(type)
  render: ->
    <div className='branch-options'>
      <div>
        <input type='radio' id='branch-master' checked={@checked('master')} onChange={@check('master')}/>
        <label htmlFor='branch-master'>
          Deploy to website immediately
        </label>
      </div>
      <div>
        <input type='radio' id='branch-pr' checked={@checked('pr')} onChange={@check('pr')}/>
        <label htmlFor='branch-pr'>
          Create a Pull Request
        </label>
      </div>
    </div>
