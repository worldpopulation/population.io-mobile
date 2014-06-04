var gulp = require('gulp'),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    stylus = require('gulp-stylus'),
    concat = require('gulp-concat'),
    nib = require('gulp-stylus/node_modules/nib'),

    sources = {
      vendor: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/d3/d3.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-cookies/angular-cookies.min.js',
        'bower_components/angular-resource/angular-resource.min.js',
        'bower_components/angular-route/angular-route.min.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/lodash/dist/lodash.min.js'
      ],
      scripts: [
        'app/scripts/**/*.js*'
      ],
      templates: 'app/views/layouts/*.jade',
      docs: 'app/views/pages/*.jade',
      partials: 'app/views/partials/**/*.jade',
      stylus: ['app/stylus/**/*.styl'],
      style: ['bower_components/fontawesome/css/font-awesome.css', 'app/stylus/main.styl'],
      overwatch: 'dist/**/*.*'
    },
    destinations = {
      vendor: 'dist/vendor/',
      scripts: 'dist/scripts/',
      docs: 'dist/',
      partials: 'dist/partials',
      css: 'dist/css/'
    };

// server task
gulp.task('serve', function (event) {
  connect.server({
    root: destinations.docs,
    port: 1983,
    livereload: true
  });
  // sets up a livereload that watches for any changes in the root
  watch({glob: sources.overwatch})
      .pipe(connect.reload());
});

// stylus task
gulp.task('stylus', function (event) {
  return gulp.src(sources.style)
      .pipe(plumber())
      .pipe(stylus({use: nib()}))
      .pipe(concat('main.css'))
      .pipe(gulp.dest(destinations.css));
});

// stylus watch task for development
gulp.task('stylus:watch', function (event) {
  watch({glob: sources.stylus}, function (files) {
    gulp.src(sources.style)
        .pipe(plumber())
        .pipe(stylus({use: nib()}))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(destinations.css));
  });
});

// scripts tasks
gulp.task('scripts', function (event) {
  gulp.src(sources.vendor)
      .pipe(plumber())
      .pipe(gulp.dest(destinations.vendor));
  return gulp.src(sources.scripts)
      .pipe(plumber())
      .pipe(gulp.dest(destinations.scripts));
});

// scripts watch task for development
gulp.task('scripts:watch', function (event) {
  gulp.src(sources.vendor)
      .pipe(plumber())
      .pipe(gulp.dest(destinations.vendor));

  watch({glob: sources.scripts}, function (files) {
    gulp.src(sources.scripts)
        .pipe(plumber())
        .pipe(gulp.dest(destinations.scripts));
  });
});

// jade tasks
gulp.task('jade', function (event) {
  gulp.src(sources.partials)
      .pipe(plumber())
      .pipe(jade({
        pretty: true
      }))

      .pipe(gulp.dest(destinations.partials));

  return gulp.src(sources.docs)
      .pipe(plumber())
      .pipe(jade({
        pretty: true
      }))

      .pipe(gulp.dest(destinations.docs));
});

// jade watch task for development
gulp.task('jade:watch', function (event) {
  watch({glob: sources.templates}, function (files) {
    gulp.src(sources.partials)
        .pipe(plumber())
        .pipe(jade({
          pretty: true
        }))

        .pipe(gulp.dest(destinations.partials));

    gulp.src(sources.docs)
        .pipe(plumber())
        .pipe(jade({
          pretty: true
        }))
        .pipe(gulp.dest(destinations.docs));
  });
  watch({glob: sources.docs})
      .pipe(plumber())
      .pipe(jade({
        pretty: true
      }))
      .pipe(gulp.dest(destinations.docs));
});

gulp.task('fonts', function () {
  return gulp.src(['bower_components/fontawesome/fonts/fontawesome-webfont.*'])
      .pipe(gulp.dest('dist/fonts/'));
});

// jshint task
gulp.task('lint', function () {
  return gulp.src('app/scripts/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// jshint watch task for development
gulp.task('lint:watch', function () {
  gulp.watch('app/scripts/**/*.js', ['lint']);
});

// clean tasks
gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
      .pipe(clean());
});

// default tasks
gulp.task('default', [
  'serve',
  'fonts',
  'jade:watch',
  'scripts:watch',
  'lint:watch',
  'stylus:watch'
]);