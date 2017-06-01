'use strict'

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const compass = require('gulp-compass');
const concat = require('gulp-concat');
const cssMin = require('gulp-cssmin');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const ngAnnotate = require('gulp-ng-annotate');
const inject = require('gulp-inject');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('js-ie8', function () {
  return gulp.src([
    'node_modules/es5-shim/es5-shim.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/angularjs-ie8-build/dist/angular.min.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
    'src/js-ie/ie.js',
    'src/js/**/*.js',
  ])
  .pipe(plumber())
  .pipe(ngAnnotate())
  .pipe(plumber())
  .pipe(concat('js-ie8.js'))
  .pipe(plumber())
  .pipe(gulp.dest('dev/js'));
});

gulp.task('lib', function () {
  return gulp.src([
    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js'
  ])
  .pipe(plumber())
  .pipe(concat('libs.js'))
  .pipe(plumber())
  .pipe(gulp.dest('dev/lib'));
});

gulp.task('js', function () {
  return gulp.src('./src/js/**/*.js')
    .pipe(plumber())
    .pipe(ngAnnotate())
    .pipe(plumber())
    .pipe(concat('app.js'))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(plumber())
    .pipe(gulp.dest('dev/js'));
});

gulp.task('compass', function() {
  return gulp.src('./src/*.scss')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(compass({
      config_file: './config.rb',
      css: './dev/css',
      sass: './src/sass'
    }))
    .pipe(plumber())
    .pipe(gulp.dest('dev/'));
});

gulp.task('autoprefixer', function() {
  return gulp.src('./dev/css/*.css')
    .pipe(plumber())
    .pipe(autoprefixer())
    .pipe(plumber())
    .pipe(gulp.dest('dev/css'));
});

gulp.task('images', function () {
  gulp.src('./src/images/*.*')
    .pipe(gulp.dest('dev/images'));
});

gulp.task('templates', function () {
  return gulp.src('./src/templates/**/*.html')
    .pipe(gulp.dest('dev/templates'));
});

gulp.task('index', function (){
  var sources = gulp.src(['./dev/lib/libs.js', './dev/js/app.js'], {
    read: false
  });
  
  return gulp.src('./src/index.html')
    .pipe(inject(gulp.src('./dev/css/*.css', {read: false}), {
      ignorePath: 'dev',
      addPrefix: '.',
      addRootSlash: false
    }))
    .pipe(inject(gulp.src([
      './dev/js/js-ie8.js'
    ], {read: false}), {
      starttag: '<!--[if lte IE 8]>',
      endtag: '<![endif]-->',
      ignorePath: 'dev',
      addPrefix: '.',
      addRootSlash: false
    }))
    .pipe(inject(gulp.src('./dev/js/app.js', {read: false}), {
      starttag: '<!--[if gte IE 9]><!-->',
      endtag: '<!--<![endif]-->',
      ignorePath: 'dev',
      addPrefix: '.',
      addRootSlash: false
    }))
    .pipe(gulp.dest('dev'));
});

gulp.task('clean', function() {
	return del('dev');
});

gulp.task('default', function (callback) {
	runSequence('clean', ['lib', 'js', 'compass', 'templates', 'images'], ['autoprefixer', 'js-ie8'], ['index'], ['watch'], callback);
});

gulp.task('watch', function () {
  watch('./src/js/**/*.js', function () {
    gulp.start('js');
    gulp.start('js-ie8');
  });
  
  watch('./src/sass/*.scss', function () {
    gulp.start('compass');
  });
  
  watch('./dev/css/*.css', function () {
    gulp.start('autoprefixer');
  });

  watch('./src/templates/**/*.html', function () {
    gulp.start('templates');
  });
  
  watch('./src/images/*.*', function () {
    gulp.start('images');
  });
  
  watch('./src/index.html', function () {
    gulp.start('index');
  });
});

gulp.task('prod', function (callback) {
	runSequence('prod-clean', ['prod-js'], ['prod-app', 'prod-app-ie8', 'prod-compass', 'prod-templates', 'prod-images'], ['prod-autoprefixer'], ['prod-index'], callback);
});

gulp.task('prod-js', function () {
  return gulp.src([
    './src/js/**/*.js'
  ])
  .pipe(plumber())
  .pipe(ngAnnotate())
  .pipe(plumber())
  .pipe(concat('js.min.js'))
  .pipe(plumber())
  .pipe(uglify())
  .pipe(plumber())
  .pipe(gulp.dest('prod/js'));
});

gulp.task('prod-app', function () {
  return gulp.src([
    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
    'prod/js/js.min.js'
  ])
  .pipe(plumber())
  .pipe(concat('app.min.js'))
  .pipe(plumber())
  .pipe(gulp.dest('prod/js'));
});

gulp.task('prod-app-ie8', function () {
  return gulp.src([
    'node_modules/es5-shim/es5-shim.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/angularjs-ie8-build/dist/angular.min.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
    'src/js-ie/ie.js',
    'prod/js/js.min.js'
  ])
  .pipe(plumber())
  .pipe(concat('app-ie8.min.js'))
  .pipe(plumber())
  .pipe(gulp.dest('prod/js'));
});

gulp.task('prod-compass', function() {
  return gulp.src('./src/*.scss')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(compass({
      config_file: './config.rb',
      css: './prod/css',
      sass: './src/sass'
    }))
    .pipe(plumber())
    .pipe(cssMin())
    .pipe(plumber())
    .pipe(gulp.dest('prod/'));
});

gulp.task('prod-autoprefixer', function() {
  return gulp.src('./prod/css/*.css')
    .pipe(plumber())
    .pipe(autoprefixer())
    .pipe(plumber())
    .pipe(gulp.dest('prod/css'));
});

gulp.task('prod-images', function () {
  gulp.src('./src/images/*.*')
    .pipe(gulp.dest('prod/images'));
});

gulp.task('prod-templates', function () {
  return gulp.src('./src/templates/**/*.html')
    .pipe(gulp.dest('prod/templates'));
});

gulp.task('prod-index', function (){
  return gulp.src('./src/index.html')
    .pipe(inject(gulp.src('./prod/css/*.css', {read: false}), {
      ignorePath: 'prod',
      addPrefix: '.',
      addRootSlash: false
    }))
    .pipe(inject(gulp.src('./prod/js/app-ie8.min.js', {read: false}), {
      starttag: '<!--[if lte IE 8]>',
      endtag: '<![endif]-->',
      ignorePath: 'prod',
      addPrefix: '.',
      addRootSlash: false
    }))
    .pipe(inject(gulp.src('./prod/js/app.min.js', {read: false}), {
      starttag: '<!--[if gte IE 9]><!-->',
      endtag: '<!--<![endif]-->',
      ignorePath: 'prod',
      addPrefix: '.',
      addRootSlash: false
    }))
    .pipe(gulp.dest('prod'));
});

gulp.task('prod-clean', function() {
	return del('prod');
});