React = require 'react/addons'
_ = require 'lodash'

Router = require 'react-router'
RouteHandler = Router.RouteHandler
Link = Router.Link

Tabs = require('./tabs')

module.exports =
React.createClass
  fullPath: ->
    @props.params.splat
  tabs: ->
    tabs = _.map @tabPaths(), (tab_path) =>
      tab_data = {
        path: tab_path.replace(/\*$/, ''),
        active: tab_path == @activeTabPath(),
      }

    _.map tabs, (tab) =>
      tab.href = @href(tabs, tab)
      tab

  tabPaths: ->
    (@fullPath() || '').split('&')

  activeTabPath: ->
    active_with_asterix = _.detect @tabPaths(), (tab_path) ->
      _.last(tab_path) == '*'

    if active_with_asterix
      active_with_asterix.slice(0, -1)
    else
      @fullPath()

  href: (tabs, new_active_tab) ->
    new_tab_list = _.map tabs, (tab) ->
      updated_tab = tab
      updated_tab.active = updated_tab.path == new_active_tab.path
      updated_tab

    @joinTabPaths(new_tab_list)

  joinTabPaths: (tabs) ->
    tab_paths = _.map tabs, (tab) ->
      if tab.active
        tab.path + '*'
      else
        tab.path

    tab_paths.join('&')

  newHref: (path) ->
    new_active_tab =
      path: path
      active: true

    unique_tabs = _.uniq _.flatten([@tabs(), new_active_tab]), (tab) ->
      tab.path

    @href(unique_tabs, new_active_tab)

  navigateHref: (path) ->
    new_tabs = _.map @tabs(), (tab) ->
      tab.path = path if tab.active
      tab

    @joinTabPaths(new_tabs)

  render: ->
    <div>
      <div className='row'>
        <div className='col editor-col full m12'>
          <div className='editor'>
            <ul>
              <Tabs tabs={@tabs()} new_tab_href={@newHref('/')} />
            </ul>
            <RouteHandler active_tab_path={@activeTabPath()} newHref={@navigateHref} editorChange={@props.editorChange} />
          </div>
        </div>
      </div>
    </div>
