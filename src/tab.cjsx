React = require 'react/addons'

Router = require 'react-router'
Link = Router.Link
# Navigation = Router.Navigation

module.exports =
React.createClass
  # mixins: [Navigation],
  # open: ->
  #   @transitionTo('file', splat: @newUrl())
  #     # <Link to='file' params={{ splat: @props.path }}>
  # newUrl: ->
  #   if @props.full_path.match(///^#{@props.path}\*?$///)
  #     @props.path
  #   else if @props.full_path.match(///&#{@props.path}\*$///)
  #     @props.path
  #   else if @props.full_path.match(///#{@props.path}[^*]///)
  #     currently_active = @props.full_path.match(///&(.+)\*$///)[0]
  #     result = @props.full_path.replace(///#{currently_active}\*///, currently_active)
  #     debugger
  #     @props.full_match
  #
  activeClass: ->
    'active' if @props.active
  render: ->
    <li className={@activeClass()}>
      <Link to='file' params={{ splat: @props.href }}>
        {@props.path}
      </Link>
    </li>
