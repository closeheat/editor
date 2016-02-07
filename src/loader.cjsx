React = require 'react'

module.exports =
React.createClass
  render: ->
    <div className='loader valign-wrapper'>
      <div className='valign loader-container'>
        <div className='row'>
          <div className="preloader-wrapper big active loader-spinner valign">
            <div className="spinner-layer spinner-red-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='action-title'>{@props.title}</div>
          <div className='action-title'>{@props.subtitle}</div>
        </div>
      </div>
    </div>
