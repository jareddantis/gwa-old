'use strict';
/* jshint node: true */

/**
    Gulpfile.js:
      Recipe for building the GWA app with Gulp.

    Part of the illustra/gwa project by @aureljared.
    Licensed under GPLv2.
*/

var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var htmlimport = require('gulp-html-import');
var htmlmin = require('gulp-htmlmin');
var less = require('gulp-less');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var svgmin = require('gulp-svgmin');
var uglify = require('gulp-uglify');

// Build & minify LESS files
gulp.task('css', ['clean-css'], function() {
    return gulp.src('./src/less/_style.less')
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
        .pipe(rename("style.css"))
        .pipe(gulp.dest('./dist/css'));
});

// Minify JS files
gulp.task('js', ['clean-js'], function() {
    return gulp.src([
        './src/js/*.js',
        './src/js/dialogs/*.js'])
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// Minify SVG files
gulp.task('svg', ['clean-svg'], function() {
    return gulp.src('./src/img/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./dist/img'));
});

// Minify index HTML file
gulp.task('html', ['clean-html'], function() {
    return gulp.src('./src/index.html')
        .pipe(htmlimport('./src/html_components/'))
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./'));
});

// Generate service worker
gulp.task('sw', function(callback) {
    var path = require('path');
    var swPrecache = require('sw-precache');
    var swConfig = {
        staticFileGlobs: [
            'index.html',
            'dist/css/style.css',
            'dist/img/**.svg',
            'dist/js/**.js',
            'favicon/**.png',
            'favicon/**.svg',
            'splash/**.png'
        ]
    };
    swPrecache.write('sw.js', swConfig, callback);
});

// Clean output directory
gulp.task('clean-css', function(){ del(['dist/css']); });
gulp.task('clean-js', function(){ del(['dist/js/script.js']); });
gulp.task('clean-svg', function(){ del(['dist/img/*.svg']); });
gulp.task('clean-html', function(){ del(['index.html']); });

// Gen + sw
gulp.task('css-sw', function() {
    runSequence('css','sw');
});
gulp.task('js-sw', function() {
    runSequence('js','sw');
});
gulp.task('svg-sw', function() {
    runSequence('svg','sw');
});
gulp.task('html-sw', function() {
    runSequence('html','sw');
});

// Gulp task to minify all files
gulp.task('default', function () {
    runSequence(
        'css',
        'js',
        'html',
        'sw'
    );
});
gulp.task('all', function(){
    runSequence(
        'css',
        'js',
        'svg',
        'html',
        'sw'
    );
});
