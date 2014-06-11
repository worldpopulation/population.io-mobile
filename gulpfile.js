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
        'bower_components/d3.slider/d3.slider.js',
        'bower_components/topojson/topojson.js',
        'bower_components/fullpage.js/vendors/jquery.easings.min.js',
        'bower_components/fullpage.js/vendors/jquery.slimscroll.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'bower_components/angular-cookies/angular-cookies.min.js',
        'bower_components/angular-resource/angular-resource.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
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
      style: [
        'bower_components/fontawesome/css/font-awesome.css',
        'bower_components/fullpage.js/jquery.fullPage.css',
        'app/stylus/main.styl'
      ],
      fonts: 'fonts/**',
      overwatch: 'dist/**/*.*',
      images: [
        'assets/sprite-icons.svg'
      ]
    },
    destinations = {
      vendor: 'dist/vendor/',
      scripts: 'dist/scripts/',
      docs: 'dist/',
      partials: 'dist/partials',
      css: 'dist/css/',
      images: 'dist/images/'
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
  var _compileAll = function() {
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
  };

  watch({glob: sources.templates}, function () {
    _compileAll();
  });

  watch({glob: sources.partials}, function () {
    _compileAll();
  });

  watch({glob: sources.docs}, function () {
    _compileAll();
  });
});

gulp.task('images', function () {
  return gulp.src(sources.images)
    .pipe(gulp.dest(destinations.images));
});

gulp.task('fonts', function () {
  gulp.src(['bower_components/fontawesome/fonts/fontawesome-webfont.*'])
      .pipe(gulp.dest('dist/fonts/'));
  gulp.src(sources.fonts)
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
  'images',
  'jade:watch',
  'scripts:watch',
  'lint:watch',
  'stylus:watch'
]);