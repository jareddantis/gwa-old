'use strict';
/* jshint node: true */

/**
    Gulpfile.js:
      Recipe for building the GWA app with Gulp.

    Part of the illustra/gwa project by @aureljared.
    Licensed under GPLv2.
*/

var del = require('del');
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

// Build & minify LESS files
gulp.task('css', function() {
    var autoprefixer = require('autoprefixer');
    var csso = require('gulp-csso');
    var less = require('gulp-less');
    var postcss = require('gulp-postcss');
    var unprefix = require('postcss-unprefix');
    del(['dist/css']);

    return gulp.src('./src/less/_style.less')
        .pipe(less())
        .pipe(postcss([
            unprefix(),
            autoprefixer()
        ]))
        .pipe(csso())
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./dist/css'));
});

// Minify JS files
gulp.task('js', function() {
    var concat = require('gulp-concat');
    del(['dist/js/script.js']);

    return gulp.src([
            './src/js/*.js',
            './src/js/dialogs/*.js'
        ])
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// Minify SVG files
gulp.task('svg', function() {
    var svgmin = require('gulp-svgmin');
    del(['dist/img/*.svg']);

    return gulp.src('./src/img/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./dist/img'));
});

// Minify index HTML file
gulp.task('html', function() {
    var htmlimport = require('gulp-html-import');
    var htmlmin = require('gulp-htmlmin');
    del(['index.html']);

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
gulp.task('sw', gulp.series(function(callback) {
    var swPrecache = require('sw-precache');
    swPrecache.write('sw.js', {
        staticFileGlobs: [
            'index.html',
            'dist/css/**.css',
            'dist/img/**.svg',
            'dist/js/**.js',
            'favicon/**.png',
            'favicon/**.svg',
            'favicon/favicon.ico',
            'splash/**.png'
        ]
    }, callback);
}, function() {
    return gulp.src('./sw.js')
        .pipe(uglify())
        .pipe(gulp.dest('./'));
}));

// Gulp task to minify all files
gulp.task('assets', gulp.parallel('css', 'js', 'html'));
gulp.task('assets-svg', gulp.parallel('assets', 'svg'));
gulp.task('default', gulp.series('assets', 'sw'));
gulp.task('all', gulp.series('assets-svg', 'sw'));
