React = require 'react'
_ = require 'lodash'

Router = require 'react-router'
RouteHandler = Router.RouteHandler
Link = Router.Link
Navigation = Router.Navigation

Tabs = require('./tabs')

module.exports =
React.createClass
  mixins: [Navigation]
  fullPath: ->
    @props.params.splat
  tabs: ->
    tabs = _.map @tabPaths(), (tab_path) =>
      path = tab_path.replace(/\*$/, '')
      name = _.last(path.split('/'))

      tab_data =
        path: path
        name: name
        active: path == @activeTabPath()

    _.map tabs, (tab) =>
      tab.href = @href(tabs, tab)
      tab.close_href = @closeHref(tabs, tab)
      tab

  tabPaths: ->
    return [] unless @fullPath()

    @fullPath().split('&')

  activeTabPath: ->
    active_with_asterix = _.find @tabPaths(), (tab_path) ->
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

  closeHref: (tabs, close_tab) ->
    new_tab_list = _.reject _.cloneDeep(tabs), (tab) ->
      tab.path == close_tab.path

    _.each new_tab_list, (tab) ->
      tab.active = false

    last_tab = _.last(new_tab_list)
    last_tab.active = true if last_tab

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

    unique_tabs = _.uniqBy _.flatten([@tabs(), new_active_tab]), 'path'

    @href(unique_tabs, new_active_tab)

  reuseTabHref: (path) ->
    new_tabs = _.map @tabs(), (tab) ->
      tab.path = path if tab.active
      tab

    unique_tabs = _.uniqBy new_tabs, 'path'

    with_active_tab = _.map unique_tabs, (tab) ->
      tab.active = true if tab.path == path
      tab

    @joinTabPaths(with_active_tab)

  checkValidPath: ->
    @transitionTo('file', splat: '*') unless @fullPath()

  render: ->
    @checkValidPath()

    <div>
      <div className='row full'>
        <div className='col m12 full code-mode-cols'>
          <Tabs tabs={@tabs()} new_tab_href={@newTabHref('')} />

          <RouteHandler
            active_tab_path={@activeTabPath()}
            reuseTabHref={@reuseTabHref}
            newTabHref={@newTabHref}
            editorChange={@props.editorChange}
          />
        </div>
      </div>
    </div>
