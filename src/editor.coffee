React = require 'react'
AceEditor = require 'react-ace'

module.exports =
Editor = React.createClass
  getInitialState: ->
    loaded: false
  onChange: (new_content) ->
    @props.onChange(new_content)
  render: ->
    <div className='col-xs-6 col-md-6 editor'>
      <AceEditor
        mode='java'
        theme='github'
        name='blah1'
        height='6em'
        onChange={@onChange}
        value={@props.value}
      />
    </div>
