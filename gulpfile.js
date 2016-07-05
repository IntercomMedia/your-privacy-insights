'use strict';
var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var watchify = require('watchify');
var eslint = require('gulp-eslint'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify'),
    gp_sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function(){
    return gulp.src([
   			'./dev/js/groundwork.js',
			'./dev/js/utilities/*.js', 
			'./dev/js/tools/*.js', 
			'./dev/js/components/*.js',
			'./dev/js/modules/*.js',
			'./dev/js/vendor/*.js',
			'./dev/js/app/*.js',
			'./dev/js/app/*/*.js'])
        .pipe(gp_sourcemaps.init())
        .pipe(gp_concat('scripts.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(gp_rename('scripts.min.js'))
        .pipe(gp_uglify())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('lint', function() {
	return gulp.src('dev/js/**').pipe(eslint({
		'rules': {
			'quotes': [1, 'single'],
			'semi': [1, 'always']
		}
	}))
	.pipe(eslint.format())
	// Brick on failure to be super strict
	.pipe(eslint.failOnError());
});

gulp.task('css', ['sass'], function () {
    var postcss      = require('gulp-postcss');
    var sourcemaps   = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');
    var cssnano 		 = require('cssnano');

    return gulp.src('./public/styles/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer({ remove: false, browsers: ['> 2%', 'IE 9'] }), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/styles/'));
});

// Compile sass files
var sass = require('gulp-sass');
gulp.task('sass', function () {
  return gulp.src('./dev/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/styles/'));
});

gulp.task('sass:watch', function () {
 	gulp.watch('./dev/sass/*.scss', ['sass']);
});