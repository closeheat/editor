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
      path = tab_path.replace(/\*$/, '')

      tab_data = {
        path: path,
        active: path == @activeTabPath(),
      }

    _.map tabs, (tab) =>
      tab.href = @href(tabs, tab)
      tab

  tabPaths: ->
    return [] unless @fullPath()

    @fullPath().split('&')

  activeTabPath: ->
    active_with_asterix = _.detect @tabPaths(), (tab_path) ->
      _.last(tab_path) == '*'

    if active_with_asterix
      active_with_asterix.slice(0, -1)
    else
      @fullPath()

  href: (tabs, new_active_tab) ->
    new_tab_list = _.map _.cloneDeep(tabs), (tab) ->
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

  newTabHref: (path) ->
    new_active_tab =
      path: path
      active: true

    unique_tabs = _.uniq _.flatten([@tabs(), new_active_tab]), (tab) ->
      tab.path

    @href(unique_tabs, new_active_tab)

  reuseTabHref: (path) ->
    new_tabs = _.map @tabs(), (tab) ->
      tab.path = path if tab.active
      tab

    unique_tabs = _.uniq new_tabs, (tab) ->
      tab.path

    with_active_tab = _.map unique_tabs, (tab) ->
      tab.active = true if tab.path == path
      tab

    @joinTabPaths(with_active_tab)

  render: ->
    <div>
      <div className='row'>
        <div className='col m12 code-mode-cols'>
          <Tabs tabs={@tabs()} new_tab_href={@newTabHref('')} />

          <RouteHandler active_tab_path={@activeTabPath()} reuseTabHref={@reuseTabHref} newTabHref={@newTabHref} editorChange={@props.editorChange} />
        </div>
      </div>
    </div>
