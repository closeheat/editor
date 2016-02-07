React = require 'react'

module.exports =
React.createClass
  getInitialState: ->
    {
      selected: 'upload'
    }
  itemClass: (type) ->
    result = 'free-hosting-type'
    result += ' free-hosting-type-selected' if @state.selected == type
    result

  handleSelect: (type) ->
    =>
      @setState(selected: type)
  getHref: ->
    if @state.selected == 'upload'
      '/apps/new/upload'
    else
      '/apps/new/templates'
  buttonText: ->
    if @state.selected == 'upload'
      'Upload my website'
    else
      'Get my website'

  maybeClose: (e) ->
    return unless e.target.className == 'free-hosting-container'

    @props.close()

  render: ->
    return <div></div> unless @props.show

    <div className='free-hosting-container' onClick={@maybeClose}>
      <div className='free-hosting center-align'>
        <div className='row free-hosting-title'>
          Create a different website
        </div>
        <div className='row'>
          <div className='col s6'>
            <div className={@itemClass('upload')} onClick={@handleSelect('upload')}>
              <div className='free-hosting-type-icon'>
                <i className='medium material-icons'>invert_colors</i>
              </div>
              <div className='free-hosting-type-title'>
                I have a website to upload
              </div>
            </div>
          </div>

          <div className='col s6'>
            <div className={@itemClass('template')} onClick={@handleSelect('template')}>
              <div className='free-hosting-type-icon'>
                <i className='medium material-icons'>album</i>
              </div>
              <div className='free-hosting-type-title'>
                Use a new template
              </div>
            </div>
          </div>

          <div className='row'>
            <a href={@getHref()} target='_blank' className="btn btn-large waves-effect waves-light free-hosting-button">
              {@buttonText()}
            </a>
          </div>

        </div>
      </div>
    </div>
