React = require 'react'
Promise = require 'bluebird'
request = require 'request'

module.exports =
React.createClass
  componentWillMount: ->
    @props.transitionWithCodeModeHistory('code', '/code/*?') unless @props.error
    @props.actionStopped()

  getInitialState: ->
    {}
  message: ->
    return unless @props.error

    msg = @props.error.toString()
    with_n_as_enter = JSON.stringify(msg).slice(1, -1)
    with_n_as_enter.replace(/\\n/g, '<br>')
  render: ->
    <div className='error'>
      <div className='row'>
        <div className='error-container col offset-s2 s8 offset-l3 l6'>
          <div className='error-title'>
            Oops. An error occured.
          </div>
          <div className='error-content' dangerouslySetInnerHTML={{ __html: @message() }}>
          </div>
        </div>
      </div>
    </div>
