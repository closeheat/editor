React = require 'react/addons'
_ = require 'lodash'

Router = require 'react-router'
Link = Router.Link
Navigation = Router.Navigation

Tab = require('./tab')

module.exports =
React.createClass
  mixins: [Navigation],
  open: ->
    @transitionTo('file', splat: @newUrl())
      # <Link to='file' params={{ splat: @props.path }}>
  newUrl: ->
    if @props.full_path.match(///^#{@props.path}\*?$///)
      @props.path
    else if @props.full_path.match(///&#{@props.path}\*$///)
      @props.path
    else if @props.full_path.match(///#{@props.path}[^*]///)
      currently_active = @props.full_path.match(///&(.+)\*$///)[0]
      result = @props.full_path.replace(///#{currently_active}\*///, currently_active)
      debugger
      @props.full_match

  tabs: ->
    tab_paths = @props.full_path.split('&')
    active = _.detect tab_paths, (tab_path) ->
      _.last(tab_path) == '*'

    _.map tab_paths, (tab_path) ->
      {
        path: tab_path.replace(/\*$/, ''),
        active: tab_path == active
      }

  href: (new_active_tab) ->
    new_tab_list = _.map @tabs(), (tab) ->
      updated_tab = tab
      updated_tab.active = updated_tab.path == new_active_tab.path
      updated_tab

    tab_paths = _.map new_tab_list, (tab) ->
      if tab.active
        tab.path + '*'
      else
        tab.path

    tab_paths.join('&')

  render: ->
    <div>
      {_.map @tabs(), (tab) =>
        <Tab href={@href(tab)} path={tab.path} active={tab.active}/>
      }
      <Link to='file' params={{ splat: '' }}>
        <div>New tab</div>
      </Link>
    </div>
