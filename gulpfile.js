var gulp = require('gulp'),
  jade = require('gulp-jade'),
  inject = require('gulp-inject'),
  clean = require('gulp-clean'),
  connect = require('gulp-connect'),
  plumber = require('gulp-plumber'),
  watch = require('gulp-watch'),
  stylus = require('gulp-stylus'),
  nib = require('gulp-stylus/node_modules/nib'),

  sources = {
    vendor: [
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
    partials: 'app/views/partials/*.jade',
    stylus: 'app/stylus/**/*.styl',
    style: 'app/stylus/main.styl',
    overwatch: 'dist/**/*.*'
  },
  destinations = {
    vendor: 'dist/vendor/',
    scripts: 'dist/scripts/',
    docs: 'dist/',
    partials: 'dist/partials',
    css: 'dist/css/'
  };
/*SERVER TASK*/
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
/*STYLUS TASK*/
gulp.task('stylus', function (event) {
  return gulp.src(sources.style)
    .pipe(plumber())
    .pipe(stylus({use: nib()}))
    .pipe(gulp.dest(destinations.css));
});

/*STYLUS WATCH TASK FOR DEVELOPMENT*/

gulp.task('stylus:watch', function (event) {
  watch({glob: sources.stylus}, function (files) {
    gulp.src(sources.style)
      .pipe(plumber())
      .pipe(stylus({use: nib()}))
      .pipe(gulp.dest(destinations.css));
  });
});

/*SCRIPTS TASK*/
gulp.task('scripts', function (event) {
   gulp.src(sources.vendor)
    .pipe(plumber())
    .pipe(gulp.dest(destinations.vendor));
  return gulp.src(sources.scripts)
    .pipe(plumber())
    .pipe(gulp.dest(destinations.scripts));
});

/*SCRIPTS WATCH TASK FOR DEVELOPMENT*/
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

/*JADE TASK*/
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

/*JADE WATCH TASK FOR DEVELOPMENT*/
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


/*CLEAN TASK*/
gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});


/*DEFAULT TASK*/
gulp.task('default', ['serve', 'jade:watch', 'scripts:watch', 'stylus:watch']);