_ = require 'lodash'
jsdom = require 'jsdom'

HTMLAnalizer = require('./html_analizer')
HTMLModifier = require('./html_modifier')
Filesystem = require('./filesystem')
FrontMatterAnalizer = require('./front_matter_analizer')

class NodeLocationExtender
  constructor: (@event, @analysis) ->

  extend: ->
    _.merge(@analysis, @coords())

  coords: ->
    switch @analysis.winner_type
      when 'html'
        position = jsdom.nodeLocation(@analysis.html.node)

        {
          position: position
        }
      when 'front_matter'
        console.log 'FRONT MATTER NOT IMPLEMENTED YET'
      else
        console.log 'NOT IMPLEMENTED'

module.exports =
class SourceFinder
  constructor: (@event, @files) ->

  source: ->
    console.log 'RUNNER UP'
    console.log _.first(_.takeRight(_.sortBy(@scores(), 'winner_score'), 2))
    winner = _.maxBy(@scores(), 'winner_score')
    new NodeLocationExtender(@event, winner).extend()

  scores: ->
    _.map @analizedFiles(), (file_analysis) =>
      winner = @chooseWinner(file_analysis)

      _.merge {
        winner_type: winner.type
        winner_score: winner.score
      }, file_analysis

  chooseWinner: (file_analysis) ->
    _.maxBy([file_analysis.html, file_analysis.front_matter], 'score')

  calculateCombinedScore: (file_analysis) ->
    _.max([file_analysis.html.score, file_analysis.front_matter.score])

  analizedFiles: ->
    _.map @files, (file) =>
      {
        front_matter: new FrontMatterAnalizer(file, @event).analize()
        html: new HTMLAnalizer(file, @event).analize()
        text: @event.text
        file: file.path
      }
