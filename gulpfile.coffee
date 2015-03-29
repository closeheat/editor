gulp = require 'gulp'
coffee = require 'gulp-coffee'
gutil = require 'gulp-util'
watch = require 'gulp-watch'
cjsx = require 'gulp-cjsx'
browserify = require 'browserify'
transform = require 'vinyl-transform'

gulp.task 'default', ['coffee', 'cjsx', 'browserify']

gulp.task 'watch', ->
  gulp.watch('./src/**/*.*', ['default'])

gulp.task 'coffee', ->
  gulp
    .src('./src/**/*.coffee')
    .pipe(coffee(bare: true).on('error', gutil.log))
    .pipe gulp.dest('./dist')

gulp.task 'cjsx', ->
  gulp
    .src('./src/**/*.cjsx')
    .pipe(cjsx({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./dist'))

gulp.task 'browserify', ->
  browserified = transform (filename) ->
    b = browserify(entries: filename)
    return b.bundle()

  gulp.src('./dist/core.js')
    .pipe(browserified)
    .pipe(gulp.dest('./browser'))
