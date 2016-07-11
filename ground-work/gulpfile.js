'use strict';
var source = require('vinyl-source-stream'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	watchify = require('watchify'),
	eslint = require('gulp-eslint'),
	notify = require("gulp-notify"),
    gp_order = require('gulp-order'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify'),
    gp_sourcemaps = require('gulp-sourcemaps'),
    jsValidate = require('gulp-jsvalidate'),
    postcss      = require('gulp-postcss'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
	cssnano 	= require('cssnano'),
	rename = require("gulp-rename");

gulp.task('js', function(){
    return gulp.src([
   			'js/groundwork.js',
			'js/utilities/*.js', 
			'js/tools/*.js', 
			'js/components/*.js',
			'js/modules/*.js',
			'js/vendor/*.js',
			'js/app/*.js',
			'js/app/*/*.js'])
        .pipe(gp_sourcemaps.init())
        .pipe(gp_concat('scripts.js'))
        .pipe(gulp.dest('../public/js/'))
        .pipe(gp_rename('scripts.min.js'))
        .pipe(gp_uglify())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('../public/js/'));
});


gulp.task('css', ['sass'], function () {

    return gulp.src('../public/styles/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer({ remove: false, browsers: ['> 2%', 'IE 9'] }), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('../public/styles/'));
});

// Compile sass files
var sass = require('gulp-sass');
gulp.task('sass', function () {
  return gulp.src('sass/config.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('main.css'))
    .pipe(gulp.dest('../public/styles/'));
});

gulp.task('sass:watch', function () {
 	gulp.watch('sass/*.scss', ['sass']);
});