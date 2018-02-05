// all connected gulp-packages
var gulp         = require('gulp'),
    gutil        = require('gulp-util' ),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    cleancss     = require('gulp-clean-css'),
    rename       = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    notify       = require('gulp-notify');

// scripts concat and minify
gulp.task('js', () => {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/js/common.js', // Always at the end
        ])
    .pipe(concat('scripts.min.js'))
    // .pipe(uglify()) // Mifify js (opt.)
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({ stream: true }))
});

// compile sass to css with prefixes
gulp.task('sass', () => {
    return gulp.src('app/sass/**/*.+(scss|sass)')
        .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
        .pipe(rename({ suffix: '.min', prefix : '' }))
        .pipe(autoprefixer(['last 15 versions', '> 1%'], 
                            {
                                cascade: true
                            }))
        .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// start browser watcher with auto-reload of page
gulp.task('watch', ['sass', 'js', 'browser-sync'], 
    () => {
        gulp.watch('app/sass/**/*.+(scss|sass)', ['sass']);
        gulp.watch(['libs/**/*.js', 'app/js/**/*.js'], browserSync.reload);
        gulp.watch(['**/*.php', '!node_modules/**/*'], browserSync.reload);
        gulp.watch('app/*.html', browserSync.reload);
    });

// configure browser-sync to base project directory
gulp.task('browser-sync', () => {
    browserSync({
        server: { baseDir: 'app' },
        notify: false
    });
});

gulp.task('default', ['watch']);
