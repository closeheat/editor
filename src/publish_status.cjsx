React = require 'react'
classNames = require 'classnames'

module.exports =
PublishStatus = React.createClass
  currentStage: ->
    @props.current || 0
  error: (i) ->
    return <span/> unless @props.error && @currentStage() == i + 1

    <div className='stage-error'>
      App name {@props.error}
    </div>
  render: ->
    return <span className='deploy-steps'/> if @currentStage() == 0

    <ul className="deploy-steps collection">
      {_.map @props.stages, (stage, i) =>
        li_classes = (_this) =>
          classNames
            'collection-item': true
            success: !_this.props.error && _this.currentStage() > i + 1
            failure: _this.props.error && _this.currentStage() == i + 1

        icon_classes = (_this) =>
          classNames
            fa: true
            icon: true
            'secondary-content': true
            'fa-check-circle': !_this.props.error && _this.currentStage() > i + 1
            'fa-circle-o-notch fa-spin': !_this.props.error && _this.currentStage() == i + 1
            'fa-exclamation-circle': _this.props.error && _this.currentStage() == i + 1

        <li key={stage} className={li_classes(@)}>
          <span className='stage-name'>{stage}</span>
          <i className={icon_classes(@)}></i>
          {@error(i)}
        </li>
      }
    </ul>
