React = require 'react'

module.exports =
Tour = React.createClass
  step1: ->
    <div className='closeheat-tour-code-editor'>
      Change "NAME" to your actual name for the magic to happen
    </div>
  step2: ->
    <div className='closeheat-tour-preview-button'>
      Click "Preview" to see your changes
    </div>
  step3: ->
    <div className='closeheat-tour-deploy-button'>
      Click "Publish" to make your changes available to public
    </div>
  render: ->
    step = @['step' + @props.step]

    if step && !@props.done
      step()
    else
      <div></div>
