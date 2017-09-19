// all connected gulp-packages
var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant')
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    notify       = require('gulp-notify');


// compile sass to css with prefixes
gulp.task('sass', () => {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], 
                            {
                                cascade: true
                            }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// minimize all js libraries to one script-file
// TODO: make more general selecting of .min.js files for libraries without mistakes
gulp.task('minimize-scripts', () => {
    return gulp.src([
            'app/libs/jquery/dist/jquery.min.js',
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js/'));
});

// minimize all css-libraries to one css-file (you should import css libs to libs.sass first)
gulp.task('css-libs-minimize', ['sass'], () => {
    return gulp.src('app/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(gulp.dest('app/css/'));
});

// start browser watcher with auto-reload of page
gulp.task('watch', ['browser-sync', 'css-libs-minimize', 'minimize-scripts'], 
    () => {
        gulp.watch('app/sass/**/*.sass', ['sass']);
        gulp.watch('app/*.html', browserSync.reload);
        gulp.watch('app/js/**/*.js', browserSync.reload);
    });

// configure browser-sync to base project directory
gulp.task('browser-sync', () => {
    browserSync({
        server: { baseDir: 'app' },
        notify: false
    });
});

// delete 'dist' folder for clean build
gulp.task('remove-dist', () => {
    return del.sync('dist');
});

// clear cached images
gulp.task('clean-cache', () => {
    return cache.clearAll();
});

// optimize images for better performance
gulp.task('image-min', () => {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

// build production code
gulp.task('build', 
    ['remove-dist', 'image-min', 'css-libs-minimize', 'minimize-scripts'], 
    () => {

        var buildCss = gulp.src([
            'app/css/main.css',
            'app/css/libs.min.css'
            ])
            .pipe(gulp.dest('dist/css'));

        var buildFonts = gulp.src([
            'app/fonts/**/*',
            ])
            .pipe(gulp.dest('dist/fonts'));

        var buildJs = gulp.src([
            'app/js/**/*',
            ])
            .pipe(gulp.dest('dist/js'));

        var buildHtml = gulp.src([
            'app/*.html',
            ])
            .pipe(gulp.dest('dist'));
    });

gulp.task('default', ['watch']);