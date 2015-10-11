React = require 'react/addons'

module.exports =
React.createClass
  checked: (type) ->
    type == @props.branch
  check: (type) ->
    (e) =>
      @props.onCheck(type)
  titleChange: (e) ->
    @props.onTitleChange(e.target.value)
  title: ->
    return unless @props.branch == 'pr'

    <div className='input-field'>
      <input id='dist-dir' type='text' value={@props.title} onChange={@titleChange}/>
      <label htmlFor='dist-dir'>
        Title for a Pull Request
      </label>
    </div>
  render: ->
    <div className='branch-options'>
      <div>
        <input type='radio' id='branch-master' checked={@checked('master')} onChange={@check('master')}/>
        <label htmlFor='branch-master'>
          Deploy to website (master branch)
        </label>
      </div>
      <div>
        <input type='radio' id='branch-pr' checked={@checked('pr')} onChange={@check('pr')}/>
        <label htmlFor='branch-pr'>
          Create a Pull Request with changes (create new branch)
        </label>
      </div>

      {@title()}
    </div>
