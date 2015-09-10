React = require 'react/addons'
Promise = require 'bluebird'
request = require 'request'

module.exports =
React.createClass
  getInitialState: ->
    dist_dir: @props.dist_dir
    slug: @props.slug
  changeDistDir: (e) ->
    @setState(dist_dir: e.target.value)
  changeSlug: (e) ->
    @setState(slug: e.target.value)
  saveChanges: ->
    @setState(saving: true)

    jobs = []
    jobs.push('dist_dir') if @state.dist_dir != @props.dist_dir
    jobs.push('slug') if @state.slug != @props.slug

    Promise.reduce(jobs, (total, name) =>
      @saveSingle(name)
    , 0).then =>
      @setState(saving: false)

  saveSingle: (name) ->
    if name == 'dist_dir'
      @props.saveDistDir(@state.dist_dir)
    else
      @props.saveSlug(@state.slug)

  render: ->
    <div className='settings'>
      <div className='row'>
        <div className='settings-container col offset-s4 s4 offset-m3 m6 offset-l4 l4'>
          <div className='row'>
            <div className='settings-title'>
              Website Settings
            </div>
          </div>

          <div className='row'>
            <div className='input-field settings-slug'>
              <input id='dist-dir' type='text' value={@state.slug} onChange={@changeSlug}/>
              <label htmlFor='dist-dir' className='active'>
                Subdomain
              </label>
            </div>
            <span className='settings-slug'>.closeheatapp.com</span>
          </div>

          <div className='input-field'>
            <input id='dist-dir' type='text' value={@state.dist_dir} onChange={@changeDistDir}/>
            <label htmlFor='dist-dir' className='active'>
              Directory to be published
            </label>
          </div>

          <div onClick={@saveChanges} className="btn btn-large waves-effect waves-light settings-save-changes-button">
            {if @state.saving then 'Saving...' else 'Save Changes'}
          </div>

        </div>
      </div>
    </div>
