
'use strict';

const path = require('path'),

      gulp = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      runSequence = require('run-sequence'),
      bowerFiles = require('main-bower-files'),
      del = require('del'),

      config = require('./config'),

      PORT = process.env.PORT || 3000
      ;

gulp.task('clean', function(done) {
  del(config.dest.folder).then(paths => {
    done();
  });
})

gulp.task('index.html', function() {
  gulp.src(path.join(config.app.folder, config.app.index))
    .pipe(plugins.watch(path.join(config.app.folder, config.app.index), ['index.html']))
    .pipe(plugins.inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
    .pipe(gulp.dest(config.dest.folder))
    ;
})

gulp.task('scss', function() {
  gulp.src(path.join(config.app.folder, config.app.scss.src))
    .pipe(plugins.watch(path.join(config.app.folder, config.app.scss.src), ['scss']))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(config.dest.folder))
    ;
})

gulp.task('prepare', function(done) {
  runSequence(
    'index.html',
    'scss',
    done
  );
})

gulp.task('webserver', ['bower_components'], function() {
  setTimeout(() => {
    gulp.src(config.dest.folder)
      .pipe(plugins.webserver({
        port: PORT,
        livereload: true,
        open: true,
        directoryListing: false,
        proxies: [{
          source: '/bower_components',
          target: 'http://localhost:' + (PORT + 1),
        }],
      }))
      ;
  }, 1000);
})

gulp.task('bower_components', function() {
  gulp.src('./bower_components')
    .pipe(plugins.webserver({
      port: PORT + 1,
      directoryListing: false,
    }))
    ;
})

gulp.task('default', function(done) {
  runSequence(
    'clean',
    'prepare',
    'webserver',
    done);
})
