gulp = require 'gulp'
coffee = require 'gulp-coffee'
gutil = require 'gulp-util'
watch = require 'gulp-watch'
coffeeify = require('gulp-coffeeify')
derequire = require('gulp-derequire')

gulp.task 'default', ['browser']

gulp.task 'watch', ->
  gulp.watch('./src/**/*.coffee', ['default'])

gulp.task 'coffee', ->
  gulp
    .src('./src/*.coffee')
    .pipe(coffee(bare: true)
      .on('error', gutil.log))
    .pipe gulp.dest('./dist')

gulp.task 'browser', ->
  gulp.src('src/**/*.coffee')
    .pipe(coffeeify(
      options: {
        # ignore_missing: true
        # standalone: true
        # "no-bundle-external": true
        bare: true
        debug: true,
        # paths: [__dirname + '/node_modules', __dirname + '/src']
      }
    ))
    .pipe(derequire())
    .pipe(gulp.dest('./browser'))
