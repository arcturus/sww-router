'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');
var mocha = require('gulp-mocha');

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

gulp.task('test', function() {
  return gulp.src('./tests/unit/*_test.js', {read: false})
    .pipe(mocha({reporter: 'spec', ui: 'tdd'}));
});

gulp.task('default', ['lint','test']);
