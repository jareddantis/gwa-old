'use strict';
/* jshint esversion: 6, node: true*/

/**
    Gulpfile.js:
      Recipe for building the GWA app with Gulp.

    Part of the illustra/gwa project by @jareddantis.
    Licensed under GPLv2.
*/

const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

// Build & minify LESS files
gulp.task('css', () => {
    const autoprefixer = require('autoprefixer');
    const csso = require('gulp-csso');
    const less = require('gulp-less');
    const postcss = require('gulp-postcss');
    const unprefix = require('postcss-unprefix');
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
gulp.task('js', () => {
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
gulp.task('svg', () => {
    const svgmin = require('gulp-svgmin');
    del(['dist/img/*.svg']);

    return gulp.src('./src/img/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./dist/img'));
});

// Minify index HTML file
gulp.task('html', () => {
    const htmlimport = require('gulp-html-import');
    const htmlmin = require('gulp-htmlmin');
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
gulp.task('sw', gulp.series((callback) => {
    const workbox = require('workbox-build');
    return workbox.generateSW({
        globDirectory: '.',
        globPatterns: [
            'index.html',
            'dist/**/*.{css,svg,js}',
            'favicon/*.{png,svg,ico}',
            'splash/*.png'
        ],
        swDest: './sw-tmp.js',
        runtimeCaching: [{
            urlPattern: /gwa/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'GwaCache',
                backgroundSync: {
                    name: 'GwaSyncQ',
                    options: {
                        maxRetentionTime: 60 * 60
                    }
                },
                broadcastUpdate: {
                    channelName: 'GwaUpdChan'
                }
            }
        }],
        skipWaiting: true
    }).then(({count, size, warnings}) => {
        warnings.forEach(console.warn);
        console.log(`${count} files will be precached, totaling ${size} bytes.`);
    });
}, () => {
    gulp.src([
            './sw-tmp.js',
            './sw-custom.js'
        ])
        .pipe(concat('./sw.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./'));

    return del(['./sw-tmp.js']);
}));

// Gulp task to minify all files
gulp.task('assets', gulp.parallel('css', 'js', 'html'));
gulp.task('assets-svg', gulp.parallel('assets', 'svg'));
gulp.task('default', gulp.series('assets', 'sw'));
gulp.task('all', gulp.series('assets-svg', 'sw'));
