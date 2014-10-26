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

    sources = {
        scripts: [
            'bower_components/momentjs/min/moment.min.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jquery-ui/jquery-ui.js',
            'bower_components/d3/d3.min.js',
            'bower_components/d3-geo-projection/index.js',
            'bower_components/d3.slider/d3.slider.js',
            'bower_components/topojson/topojson.js',
            'bower_components/lodash/dist/lodash.min.js',
            'bower_components/bowser/bowser.min.js',
            'bower_components/ics.js/ics.deps.min.js',
            'bower_components/ics.js/ics.js',
            'vendor/d3.geo.projection.v0.min.js',
            'app/scripts/ga.js',

            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-scroll/angular-scroll.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-easy-social-share/easy-social-share.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-sanitize/angular-sanitize.js',

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
            'assets/user-female.png',
            'assets/user-male.png',
            'assets/favicon.png',
            'assets/wip.svg',
            'assets/browsers-sprite.png'
        ],
        celebs: 'assets/celebrities/**'
    },
    destinations = {
        scripts: 'dist/scripts/',
        docs: 'dist/',
        partials: 'dist/partials',
        css: 'dist/css/',
        images: 'dist/images/',
        celebs: 'dist/celebrities/'
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
    return gulp.src('app/scripts/data/country_continent.csv')
        .pipe(plumber())
        .pipe(gulp.dest('dist/data'));
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
    gulp.src(sources.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        //    .pipe(uglify({mangle: false,drop_console:true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destinations.scripts));
});

//// scripts watch task for development
//gulp.task('scripts:watch', function (event) {
//  gulp.src(sources.vendor)
//    .pipe(plumber())
//    .pipe(gulp.dest(destinations.vendor));
//
//  watch({glob: sources.scripts}, function (files) {
//    gulp.src(sources.scripts)
//      .pipe(plumber())
//      .pipe(gulp.dest(destinations.scripts));
//  });
//});

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

gulp.task('celebs', function () {
    return gulp.src(sources.celebs)
        .pipe(gulp.dest(destinations.celebs));
});

gulp.task('fonts', function () {
    gulp.src(['bower_components/fontawesome/fonts/fontawesome-webfont.*'])
        .pipe(gulp.dest('dist/fonts/'));
    gulp.src(sources.fonts)
        .pipe(gulp.dest('dist/fonts/'));
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
    gulp.src([
        '!dist/celebrities/**',
        'dist/**'
    ])
        .pipe(sftp({
            host: '104.130.5.217',
            auth: 'keyMain',
            remotePath: '/var/www/population.io'
        }));
});

// default tasks
gulp.task('default', [
    'serve',
    'fonts',
    'data',
    'images:watch',
    'jade:watch',
    'scripts',
    'lint:watch',
    'stylus:watch'
]);

gulp.task('deploy', [
    'upload'
]);