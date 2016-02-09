_ = require 'lodash'
matter = require('gray-matter')

HTMLAnalizer = require('./html_analizer')
FrontMatterAnalizer = require('./front_matter_analizer')

module.exports =
class SourceFinder
  constructor: (@event, @files) ->

  source: ->
    console.log 'RUNNER UP'
    console.log _.first(_.takeRight(_.sortBy(@scores(), 'winner_score'), 2))
    _.maxBy @scores(), 'winner_score'

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
      parsed_file = matter(file.content)

      {
        front_matter: new FrontMatterAnalizer(parsed_file.data, @event).analize()
        html: new HTMLAnalizer(parsed_file.content, @event).analize()
        text: @event.text
        file: file.path
      }
