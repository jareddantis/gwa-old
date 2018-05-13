'use strict';
/* jshint node: true */

/**
    Gulpfile.js:
      Recipe for building the GWA app with Gulp.

    Part of the illustra/gwa project by @aureljared.
    Licensed under GPLv2.
*/

var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var less = require('gulp-less');
var runSequence = require('run-sequence');
var svgmin = require('gulp-svgmin');
var uglify = require('gulp-uglify');

// Build & minify LESS files
gulp.task('styles', function() {
	return gulp.src('./src/less/main.less')
	    .pipe(less())
	    .pipe(autoprefixer({"browsers": [
			'ie >= 10',
			'ie_mob >= 10',
			'ff >= 30',
			'chrome >= 34',
			'safari >= 7',
			'opera >= 23',
			'ios >= 7',
			'android >= 4.4',
			'bb >= 10'
		]}))
    	.pipe(csso())
	    .pipe(gulp.dest('./dist/css'));
});

// Minify JS files
gulp.task('scripts', function() {
	return gulp.src('./src/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'));
});

// Minify SVG files
gulp.task('svg', function() {
	return gulp.src('./src/img/*.svg')
		.pipe(svgmin())
		.pipe(gulp.dest('./dist/img'));
});

// Clean output directory
gulp.task('clean', function() { del(['dist']); });

// Gulp task to minify all files
gulp.task('default', ['clean'], function () {
	runSequence(
		'styles',
		'scripts',
		'svg'
	);
});
