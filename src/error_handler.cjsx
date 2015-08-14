React = require 'react/addons'
Promise = require 'bluebird'
request = require 'request'

module.exports =
React.createClass
  getInitialState: ->
    @props.transitionWithCodeModeHistory('code', '/code/*?') unless @props.error

    {}
  message: ->
    msg = @props.error.toString()
    msg.replace("\n", '<br>')
  render: ->
    <div className='error valign-wrapper'>
      <div className='valign'>
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
    </div>
