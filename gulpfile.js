var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
//var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sh = require('shelljs');
var connect = require('gulp-connect');
// var jshint = require('gulp-jshint');

var env = process.env.NODE_ENV || 'development';

var paths = {
    sass: ['./_build/scss/**/*.scss'],
    build: ['./_build/']
};


gulp.task('build', ['copy', 'uglify', 'connect', 'watch']);
gulp.task('dev-no-uglify', ['connect-no-uglify', 'watch']);

/* not needed */
gulp.task('cssnano', function() {
    gulp.src('./app/app.css')
        .pipe(cssnano())
        .pipe(gulp.dest('./_build/app.min.css'));
});

gulp.task('copy', function() {

    console.log('Copying js frameworks...');
    gulp.src(['./app/bower_components/jquery/dist/jquery.min.js',
        './app/bower_components/bootstrap/dist/js/bootstrap.min.js',
        './app/bower_components/angular/angular.js',
        './app/bower_components/angular-route/angular-route.js',
        './app/bower_components/angular-sanitize/angular-sanitize.js',
        './app/bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
        './app/components/version/*.js'
    ]).pipe(gulp.dest('_build/js/'));


    console.log('Copying global style sheets...');
    gulp.src(['./app/bower_components/html5-boilerplate/dist/css/normalize.css',
        './app/bower_components/html5-boilerplate/dist/css/main.css',
        './app/app.css',
        './app/css/*.css'])
        .pipe(cssnano())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('_build/css/'));

    gulp.src('./app/bower_components/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('_build/css/'));

    console.log('Copying images...');
    gulp.src(['./app/img/*.jpg', './app/img/*.png', './app/img/*.gif'])
        .pipe(gulp.dest('_build/img/'));

    console.log('Copying json files...');
    gulp.src('./app/data/*.json')
        .pipe(gulp.dest('_build/data/'));

    console.log('Copying fonts...');
    gulp.src('./app/bower_components/bootstrap/fonts/*')
        .pipe(gulp.dest('_build/fonts/'));

    console.log('Copying html files...');
    gulp.src(['./app/index.html',
        './app/**/*.html',
        '!./app/index-async.html',
        '!./app/bower_components/**/*.html'])
        .pipe(gulp.dest('_build/'));
});

gulp.task('uglify', function() {
    console.log('Combining and uglifying js files into app.js...');
    return gulp.src([
            './app/home/home.js',
        './app/projects/projects-page.js',
        './app/screenshots/jacksOrBetter.js',
        './app/screenshots/training.js',
            './app/resume/resume.js',
        './app/vpt/basics.js',
        './app/vpt/practice.js',
        './app/vpt/tactics.js',
            './app/app.js'
        ])
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('./_build/'));
});

gulp.task('watch', function() {
    gulp.watch(['./app/**/*.html', './app/index.html', './app/app.css', './app/css/*.css'], ['html', 'copy']);
    gulp.watch(['./app/**/*.js', './app/app.js'], ['uglify', 'html']);
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});

gulp.task('connect', function() {
    connect.server({
        root: './_build',
        livereload: true
    });
});

gulp.task('dev', function() {
    connect.server({
        root: './app',
        livereload: true
    });
});

gulp.task('html', function() {
    gulp.src('./_build/*.html')
        .pipe(connect.reload());
});


