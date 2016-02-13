jsdom = require 'jsdom'
_ = require 'lodash'

module.exports =
class NodeLocationExtender
  constructor: (@event, @combination) ->

  extend: ->
    _.merge(@combination, @coords())

  coords: ->
    switch @combination.type
      when 'html'
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
