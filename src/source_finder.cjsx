_ = require 'lodash'
matter = require('gray-matter')

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
    _.max([file_analysis.html.score, file_analysis.front_matter.score])

  analizedFiles: ->
    _.map @files, (file) =>
      parsed_file = matter(file.content)

      {
        front_matter: new FrontMatterAnalizer(parsed_file.data, @event).analize()
        html: new HTMLAnalizer(parsed_file.content, @event).analize()
        inner_text: @event.inner_text
        file: file.path
      }
