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
        position = jsdom.nodeLocation(@combination.node)

        {
          position: position
        }
      when 'front_matter'
        console.log 'FRONT MATTER NOT IMPLEMENTED YET'
        {}
      else
        console.log 'NOT IMPLEMENTED'
        {}
