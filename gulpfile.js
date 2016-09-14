'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');

/*usable from terminal*/
gulp.task('default', function(){
  runSequence('dev');
});

gulp.task('dev', ['build','connect', 'watch']);

gulp.task('build', function(){
  runSequence('build-main','libs','build-app','build-css','minify-html','images','fonts');
});

/*end usable from terminal*/

gulp.task('connect', function() {
  connect.server({
  	root: 'public',
    port: 404,
    livereload: true
  });
});


gulp.task('lint', function() {
  return gulp.src('./app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('gulp-jshint-file-reporter', {
      filename: './jshint-output.log'
    }))
    .pipe(jshint.reporter('default'));
});

gulp.task('images', function(){
	return gulp.src('./images/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./public/images'));
});

gulp.task('browserify', function() {
	return browserify('./app/generator.js')
	.bundle().pipe(source('app.js'))
	.pipe(gulp.dest('public/js/'));
});

gulp.task('minify-js', function() {
  return gulp.src('public/js/app.js')
    .pipe(uglify({mangle:false}))
    .pipe(gulp.dest('public/js/'));
});

gulp.task('brows-dev', function(){
	return browserify('./app/generator.js')
	.bundle()
  .pipe(source('app.js'))
	.pipe(gulp.dest('./public/js/'));
});

gulp.task('main', function() {
	return browserify('./main.js')
	.bundle().pipe(source('main.js'))
	.pipe(gulp.dest('public/js/'));
});

gulp.task('minify-main', function() {
  return gulp.src('public/js/main.js')
    .pipe(uglify({mangle:true}))
    .pipe(gulp.dest('public/js/'));
});

gulp.task('sass', function() {
	return gulp.src('./sass/style.scss')
			.pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('public/css'));
});

gulp.task('minify-css', function() {
  return gulp.src('public/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('libs', function() {
  return gulp.src('libs/*.*')
    .pipe(gulp.dest('public/libs/'));
});

gulp.task('minify-html', function() {
  return gulp.src('./markup/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./public/'));
});

gulp.task('fonts', function(){
  return gulp.src('./fonts/**/*.*')
  .pipe(gulp.dest('./public/fonts'));
});

gulp.task('build-app', function(){
  runSequence('browserify','minify-js');
});

gulp.task('build-css', function(){
  runSequence('sass','minify-css');
});

gulp.task('build-main', function(){
  runSequence('main','minify-main');
});

gulp.task('watch', function(){
	gulp.watch('libs/**/*.*', ['libs']);
	gulp.watch('app/**/*.js', ['brows-dev']);
	gulp.watch('./sass/*.scss', [ 'build-css' ]);
	gulp.watch('markup/**/*.html', ['minify-html']);
	gulp.watch('images/**/*', ['images']);
});
