var gulp = require('gulp'),
jade = require('gulp-jade'),
jshint = require('gulp-jshint'),
clean = require('gulp-clean'),
connect = require('gulp-connect'),
plumber = require('gulp-plumber'),
watch = require('gulp-watch'),
stylus = require('gulp-stylus'),
concat = require('gulp-concat'),
sourcemaps = require('gulp-sourcemaps'),
uglify = require('gulp-uglify'),
nib = require('gulp-stylus/node_modules/nib'),
sftp = require('gulp-sftp'),
gulpNgConfig = require('gulp-ng-config'),
streamqueue = require('streamqueue'),
runSequence = require('run-sequence')
;

sources = {
  scripts: [
    'bower_components/momentjs/moment.js',
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jquery-ui/jquery-ui.js',
    'bower_components/d3/d3.js',
    'bower_components/d3.slider/d3.slider.js',
    'bower_components/topojson/topojson.js',
    'vendor/d3.geo.projection.v0.min.js',
    'bower_components/lodash/dist/lodash.js',
    'bower_components/bowser/bowser.js',
    'bower_components/ics.js/ics.deps.min.js',
    'bower_components/ics.js/ics.js',
    'app/scripts/ga.js',

    'bower_components/angular/angular.js',
    'bower_components/angular-touch/angular-touch.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angular-scroll/angular-scroll.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-easy-social-share/easy-social-share.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    'bower_components/angular-cookies/angular-cookies.js',
    'bower_components/angular-resource/angular-resource.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-sanitize/angular-sanitize.js',
    'bower_components/angular-translate/angular-translate.js',
    'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
    'bower_components/angular-carousel/dist/angular-carousel.js',

    'app/scripts/app.js',
    'app/scripts/controllers.js',
    'app/scripts/directives.js',
    'app/scripts/directives/*.js',
    'app/scripts/filters.js',
    'app/scripts/services.js',
    'app/scripts/services/*.js',
    'app/scripts/libs/*.js',
  ],
  templates: 'app/views/layouts/*.jade',
  docs: 'app/views/pages/*.jade',
  partials: 'app/views/partials/**/*.jade',
  stylus: ['app/stylus/**/*.styl'],
  style: [
    'bower_components/fontawesome/css/font-awesome.css',
    'bower_components/angular-carousel/dist/angular-carousel.css',
    'app/stylus/main.styl'
  ],
  fonts: 'fonts/**',
  overwatch: [
    'dist/**/*.*',
    '!dist/celebrities/**',
    '!dist/assets/**'
  ],
  images: [
    'assets/sprite-icons.svg',
    'assets/user-female.svg',
    'assets/user-male.svg',
    'assets/favicon.png',
    'assets/wip.svg',
    'assets/browsers-sprite.png',
    'assets/arrow-icaldownload.svg',
    'assets/beta_opt.png',
    'assets/humans-blueman.svg',
    'assets/humans-bluewoman.svg',
    'assets/share-twitter.svg',
    'assets/share-facebook.svg',
    'assets/share-li.svg',
    'assets/share-ical.svg',
    'assets/ballon-paths-w-b.svg',
    'assets/right-share.svg',
    'assets/country-icon.svg',
    'assets/day-form.svg',
    'assets/beta_opt.svg',
    'assets/close-icon.svg',
    'assets/menu-bar.svg',
    'assets/humans-green.svg'
  ],
  maps: [
    'bower_components/angular-sanitize/angular-sanitize.min.js.map'
  ],
  celebs: 'assets/celebrities/**',
  translations: [
    'app/i18n/DE.json',
    'app/i18n/EN.json',
    'app/i18n/ES.json'
  ]
},
destinations = {
  scripts: 'dist/scripts/',
  docs: 'dist/',
  partials: 'dist/partials',
  css: 'dist/css/',
  images: 'dist/images/',
  celebs: 'dist/celebrities/',
  translations: 'dist/i18n'
};

// server task
gulp.task('serve', function (event) {
  connect.server({
    root: destinations.docs,
    port: 1983,
    livereload: true,
    host: '0.0.0.0'
  });
  // sets up a livereload that watches for any changes in the root
  watch({glob: sources.overwatch})
  .pipe(connect.reload());
});

// data files task
gulp.task('data', function (event) {
  return gulp.src([
    'data/populationio_countries/countries.csv',
    'data/populationio_countries/countries_topo.json',
  ])
  .pipe(plumber())
  .pipe(gulp.dest('dist/data'));
});

// stylus task
gulp.task('stylus', function (event) {
  return gulp.src(sources.style)
  .pipe(plumber())
  //.pipe(stylus({use: nib()}))
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

  var config = gulp.src('config.json')
  .pipe(gulpNgConfig('popioconfig', {
    environment: 'production'
  }));

  var src = gulp.src(sources.scripts)
  .pipe(sourcemaps.init())
  .pipe(concat('main.js'));

  return streamqueue({objectMode: true }, src, config)
  .pipe(concat('main.js'))
  .pipe(uglify({mangle: false, drop_console: true}))
  // .pipe(sourcemaps.write('../maps'))
  .pipe(gulp.dest(destinations.scripts));

});

gulp.task('trans', function (event) {
  return gulp.src(sources.translations)
  .pipe(gulp.dest(destinations.translations));
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
  var _compileAll = function () {
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

gulp.task('images:watch', function () {
  watch({glob: sources.images}, function (files) {
    gulp.src(sources.images)
    .pipe(gulp.dest(destinations.images));
  });
});

gulp.task('images', function () {
  return gulp.src(sources.images)
  .pipe(gulp.dest(destinations.images));
});

gulp.task('celebs', function () {
  return gulp.src(sources.celebs)
  .pipe(gulp.dest(destinations.celebs));
});

gulp.task('fonts', function () {
  gulp.src(['bower_components/fontawesome/fonts/fontawesome-webfont.*'])
  .pipe(gulp.dest('dist/fonts/'));
  return gulp.src(sources.fonts)
  .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('maps', function () {
  return gulp.src(sources.maps)
  .pipe(gulp.dest(destinations.scripts));
});

// jshint task
gulp.task('lint', function () {
  return gulp.src(['app/scripts/**/*.js', '!app/scripts/libs/**/*.js'])
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

// upload to server task
gulp.task('upload', function () {
  return gulp.src([
    '!dist/assets/celebrities/**',
    'dist/**'
  ])
  .pipe(sftp({
    host: '162.209.106.29',
    auth: 'keyMain',
    remotePath: '/html/'
  }));
});

// default tasks
gulp.task('default', [
  'serve',
  'fonts',
  // 'maps',
  'data',
  'images:watch',
  'jade:watch',
  'scripts',
  'trans',
  'lint:watch',
  'stylus:watch'
]);

gulp.task('deploy', function(callback) {
  runSequence(
    [
      'fonts',
      'data',
      'images',
      'jade',
      'scripts',
      'trans',
      'stylus'
    ],
    'upload',
    callback
  );
});

// gulp.task('deploy', ['upload']);
