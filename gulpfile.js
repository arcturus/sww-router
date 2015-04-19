'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

var getBundleName = function () {
  return 'sww-router';
};

gulp.task('watch', function() {
  gulp.watch('./lib/*', ['lint', 'test']);
});

gulp.task('lint', function() {
  return gulp.src(['./index.js', './tests/**/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('test', function(cb) {
  gulp.src(['./index.js'])
    .pipe(istanbul({
      reporters: ['lcov', 'json', 'text']
    }))
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['./tests/unit/*_test.js'])
        .pipe(mocha({reporter: 'spec', ui: 'tdd'}))
        .pipe(istanbul.writeReports())
        .once('end', cb);
    });
});

gulp.task('default', ['lint','test']);
