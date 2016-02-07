React = require 'react'

module.exports =
React.createClass
  render: ->
    <div className='published valign-wrapper'>
      <div className='valign published-container'>
        <div className='published-icon row center-align'>
          <i className='material-icons'>favorite_border</i>
        </div>
        <div className='row center-align'>
          <div className='published-title'>
            <div>
              Phew, everything is great.
            </div>
            <div>
              Your landing page has been published.
            </div>
          </div>

          <a href={@props.website_url} target='_blank' className="btn btn-large waves-effect waves-light published-button">
            <div>
              Open my landing page
              <span className='published-button-icon'>
                <i className='material-icons'>open_in_new</i>
              </span>
            </div>
            <div className='published-button-subtitle'>
              {@props.website_url.replace('http://', '')}
            </div>
          </a>
        </div>
      </div>
    </div>
