jsdom = require 'jsdom'
_ = require 'lodash'

module.exports =
class NodeLocationExtender
  constructor: (@event, @combination) ->

  extend: ->
    _.merge(@combination, @coords())

  noContentPositions: ->
    start_tag_position = jsdom.nodeLocation(@combination.node)

    parent_start_tag = jsdom.nodeLocation(@combination.node.parentElement).startTag
    offset = parent_start_tag.end - parent_start_tag.start

    fixed_positions =
      start: start_tag_position.start + offset
      end: start_tag_position.end + offset

    {
      content_position: {}
      start_tag_position: fixed_positions
    }

  coords: ->
    switch @combination.type
      when 'html'
        NO_CONTENT_TAGS = ['INPUT', 'BUTTON', 'IMG']
        return @noContentPositions() if _.includes(NO_CONTENT_TAGS, @combination.node.tagName)

        content_position = jsdom.nodeLocation(@combination.node)
        start_tag_position = jsdom.nodeLocation(@combination.node.parentElement).startTag

        {
          content_position: content_position
          start_tag_position: start_tag_position
        }
      when 'front_matter'
        console.log 'FRONT MATTER NOT IMPLEMENTED YET'
        {}
      else
        console.log 'NOT IMPLEMENTED'
        {}
