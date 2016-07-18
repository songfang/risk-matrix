
'use strict';

const path = require('path'),

      gulp = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      runSequence = require('run-sequence'),
      bowerFiles = require('main-bower-files'),
      through = require('through2'),
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
  let src = path.join(config.app.folder, config.app.index);
  let app = gulp.src(path.resolve(path.join(config.dest.folder, config.app.js.dest)), { read: false });
  gulp.src(src)
    .pipe(plugins.watch(src))
    .pipe(plugins.inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
    .pipe(plugins.inject(app, {
        transform: (path, file, i, length) => {
          let newPath = path.replace(config.dest.folder.replace(/\./, ''), '');
          return `<script src="${newPath}"></script>`;
        },
        name: 'app',
      }))
    .pipe(gulp.dest(config.dest.folder))
    ;
})

gulp.task('scss', function() {
  let src = path.join(config.app.folder, config.app.scss.src);
  gulp.src(src)
    .pipe(plugins.watch(src))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(config.dest.folder))
    ;
})

gulp.task('javascript', function(done) {
  let src = path.join(config.app.folder, config.app.js.src);
  gulp.src(src)
    .pipe(plugins.watch(src))
    .pipe(plugins.continuousConcat(config.app.js.dest))
    .pipe(gulp.dest(config.dest.folder))
    .pipe(through.obj((file, enc, next) => {
      next();
      done();
    }))
    ;
})

gulp.task('prepare', function(done) {
  runSequence(
    'javascript',
    'scss',
    'index.html',
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
//    'clean',
    'prepare',
    'webserver',
    done);
})
