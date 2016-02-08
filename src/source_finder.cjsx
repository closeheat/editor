_ = require 'lodash'
HTMLAnalizer = require('./html_analizer')
FrontMatterAnalizer = require('./front_matter_analizer')

module.exports =
class SourceFinder
  constructor: (@event, @files) ->

  source: ->
    _.maxBy @scores(), 'combined_score'

  scores: ->
    _.map @analizedFiles(), (file_analysis) =>
      _.merge {
        combined_score: @calculateCombinedScore(file_analysis)
      }, file_analysis

  calculateCombinedScore: (file_analysis) ->
    file_analysis.html.score

  analizedFiles: ->
    _.map @files, (file) =>
      {
        front_matter: new FrontMatterAnalizer(file, @event).analize()
        html: new HTMLAnalizer(file, @event).analize()
        inner_text: @event.inner_text
      }
