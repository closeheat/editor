Promise = require('bluebird')

Github = require('github-api')

_ = require 'lodash'

$ = require 'jquery'
jade = require('jade-memory-fs')

module.exports =
class Editor
  init: ->
    @addFilesToFs().then =>
      @rerender()

  rerender: ->
    url_file = 'index'

    @renderBrowser(jade.renderFile("/#{url_file}.jade"))

  addFilesToFs: ->
    @getFiles().then (objs) =>
      dirs = _.select objs, (file) -> file.type == 'tree'
      _.each dirs, (dir) -> fs.mkdirpSync("/#{dir.path}")

      files = _.select objs, (obj) -> obj.type == 'blob'
      Promise.all(@filesOnlyToFs(files))

  filesOnlyToFs: (files) ->
    result = []

    _.each files, (file) =>
      promise = new Promise (resolve, reject) =>
        @repo().read 'master', file.path, (err, contents) =>
          return reject(err) if err

          fs.writeFileSync("/#{file.path}", contents)
          resolve()

      result.push(promise)

    result

    # @htmlFiles().then (files) =>
    #   _.each files, (file) =>
    #     console.log file
    #     @repo().read 'master', file.path, (err, contents) =>
    #
    #       console.log file
    #       # console.log contents
    #       # console.log jade.render(contents)
    #       # console.log @newContent()
    #       # console.log jade.render(@newContent())
    #       debugger
    #       @renderBrowser(jade.renderFile('/index.jade'))
    #       # document.write(jade.render(@newContent()))

  renderBrowser: (content) ->
    console.log @appendBase(content)
    src = "data:text/html;charset=utf-8,#{encodeURIComponent(@appendBase(content))}"
    original_embed = $('#browser')
    new_embed = original_embed.clone()
    new_embed.prop('src', src)
    original_embed.replaceWith(new_embed)

  appendBase: (content) ->
    result = content
    result = result.replace(/href\=\"/, 'href="http://localhost:9000/')
    result.replace(/src\=\"/, 'src="http://localhost:9000/')

  newContent: ->
    """
    html
      head
        title Beautiful Angular
        link(rel='stylesheet', href='vendor/css/bootstrap.min.css')
        link(rel='stylesheet', href='css/app.css')
        script(src='js/app.js')
      body(ng-app='beautiful')
        include favicons
        section(ng-controller='HomeController')
          h1 {{ heading() }} with something
          input(type='text', ng-model='name')
    """

  github: ->
    new Github
      token: 'cbd944cd163811f10bb0d3747116e694cab02c07'
      auth: 'oauth'

  repo: ->
    @github().getRepo('Nedomas', 'testing-closeheat-angular')

  htmlFiles: ->
    new Promise (resolve, reject) =>
      @repo().getTree 'master?recursive=true', (err, contents) ->
        return reject(err) if err

        html = _.select contents, (file) ->
          file.path.match(/\.jade$/)

        resolve(html)

  getFiles: ->
    new Promise (resolve, reject) =>
      @repo().getTree 'master?recursive=true', (err, contents) ->
        return reject(err) if err

        resolve(contents)
