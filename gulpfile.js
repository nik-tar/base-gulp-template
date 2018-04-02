// all connected gulp-packages
var gulp         = require('gulp'),
    gutil        = require('gulp-util' ),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify-es').default,
    sourcemaps   = require('gulp-sourcemaps'),
    cleancss     = require('gulp-clean-css'),
    rename       = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    notify       = require('gulp-notify'),
    debug        = require('gulp-debug');

// configuration
var config = {
    srcDir: 'assets',
    libsDir: 'assets/libs',
    patterns: {
        sass: 'sass/**/*.+(scss|sass)',
        css: '**/*.css',
        html: '*.html',
        js: 'js/**/*.js',
        php: '**/*.php',
        disableModules: '!node_modules/**/*',
        disableCssDir: '!assets/css/**/*'
    }
};

var app = {};

app.addStyle = function(paths, outputFilename) {
    return gulp.src(paths)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
        .pipe(debug({title: 'input files:'}))
        .pipe(concat(outputFilename))
        .pipe(debug({title: 'concat into:'}))
        .pipe(autoprefixer(['last 15 versions', '> 1%'], 
                            {
                                cascade: true
                            }))
        .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.srcDir + '/css'))
        .pipe(browserSync.reload({ stream: true }));
}

app.addScript = function(paths, outputFilename) {
    return gulp.src(paths)
    .pipe(sourcemaps.init())
    .pipe(concat(outputFilename))
    // .pipe(uglify()) // Mifify js (opt.)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.srcDir + '/js'))
    .pipe(browserSync.reload({ stream: true }))
}

// scripts concat and minify
gulp.task('js', () => {
    app.addScript([
        // config.libsDir + '/jquery/dist/jquery.min.js',
        config.srcDir + '/js/common.js',
    ], 'scripts.min.js');
});

// compile sass to css with prefixes
gulp.task('styles', () => {
    app.addStyle([
        config.srcDir + '/' + config.patterns.sass
    ], 'main.min.css');
});

// start browser watcher with auto-reload of page
gulp.task('watch', ['styles', 'js', 'browser-sync'], 
    () => {
        gulp.watch([config.srcDir + '/' + config.patterns.sass,
                    config.patterns.css,
                    config.patterns.disableCssDir], 
                    ['styles']);
        gulp.watch([config.libsDir + '/**/*.js', 
                    config.srcDir + '/' + config.patterns.js], 
                    browserSync.reload);
        gulp.watch([config.patterns.php, 
                    config.patterns.disableModules], 
                    browserSync.reload);
        gulp.watch(config.srcDir + '/' + config.patterns.html, 
                    browserSync.reload);
    });

// configure browser-sync to base project directory
gulp.task('browser-sync', () => {
    browserSync({
        server: { baseDir: config.srcDir }, // set it if needed
        notify: false,
        open: false,
        // proxy: "your-address",
        // host: "your-computer-local-network-address",
        // tunnel: true,
        // tunnel: "projectname", //Demonstration page: http://projectname.localtunnel.me
    });
});

gulp.task('default', ['watch']);
