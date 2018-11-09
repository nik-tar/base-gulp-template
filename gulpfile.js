// all connected gulp-packages
var gulp = require( 'gulp' ),
  gutil = require( 'gulp-util' ),
  gulpif = require( 'gulp-if' ),
  sass = require( 'gulp-sass' ),
  browserSync = require( 'browser-sync' ),
  concat = require( 'gulp-concat' ),
  babel = require( 'gulp-babel' ),
  uglify = require( 'gulp-uglify-es' ).default,
  sourcemaps = require( 'gulp-sourcemaps' ),
  cleancss = require( 'gulp-clean-css' ),
  htmlclean = require( 'gulp-htmlclean' ),
  rename = require( 'gulp-rename' ),
  autoprefixer = require( 'gulp-autoprefixer' ),
  notify = require( 'gulp-notify' ),
  del = require( 'del' ),
  debug = require( 'gulp-debug' );

// configuration
var config = {
  srcDir: 'assets',
  libsDir: 'node_modules',
  patterns: {
    sass: 'sass/**/*.+(scss|sass)',
    css: '**/*.css',
    html: '*.html',
    js: 'js/**/*.js',
    php: '**/*.php',
    disableModules: '!node_modules/**/*',
    disableCssDir: '!assets/css/**/*',
    disableCompiledJs: 'js/+(scripts.min.js|scripts.min.js.map|components.min.js|components.min.js.map)'
  },
  distDir: './dist',
  distIndex: 'dist/index.html',
  distCSS: 'dist/**/*.css',
  distJS: 'dist/**/*.js'
};

var app = {};
var LIBRARIES = false;

app.addStyle = function ( paths, outputFilename, destDir ) {
  return gulp.src( paths )
    .pipe( sourcemaps.init() )
    .pipe( sass( { outputStyle: 'expand' } ).on( "error", notify.onError() ) )
    .pipe( debug( { title: 'input files css:' } ) )
    .pipe( concat( outputFilename ) )
    .pipe( debug( { title: 'css concat into:' } ) )
    .pipe( autoprefixer( ['last 15 versions', '> 1%'],
      {
        cascade: true
      }) )
    .pipe( cleancss( { level: { 1: { specialComments: 0 } } } ) ) // Opt., comment out when debugging
    .pipe( sourcemaps.write( '.', { sourceRoot: config.srcDir } ) )
    .pipe( gulp.dest( destDir ) );
}

app.addScript = function ( paths, outputFilename, destDir, libs ) {
  return gulp.src( paths )
    .pipe( sourcemaps.init() )
    .pipe( debug( { title: 'input files js:' } ) )
    .pipe( concat( outputFilename ) )
    .pipe( debug( { title: 'js concat into:' } ) )
    // .pipe(uglify()) // Mifify js (opt.)
    .pipe( gulpif( ! libs, babel( {
      presets: ['@babel/env']
    } ) ) )
    .pipe( sourcemaps.write( '.', { sourceRoot: config.srcDir } ) )
    .pipe( gulp.dest( destDir ) );
}

// scripts concat and minify
gulp.task( 'js', function ( done ) {

  // there are libraries
  app.addScript([
    config.libsDir + '/@babel/polyfill/dist/polyfill.min.js',
    config.libsDir + '/jquery/dist/jquery.min.js',
  ], 'components.min.js', config.srcDir + '/js/', LIBRARIES );

  // there are custom app scripts
  app.addScript([
    config.srcDir + '/js/common.js',
  ], 'scripts.min.js', config.srcDir + '/js/', ! LIBRARIES );

  done();
} );

// compile sass to css with prefixes
gulp.task( 'styles', function ( done ) {
  app.addStyle([
    config.srcDir + '/' + config.patterns.sass,
  ], 'main.min.css', config.srcDir + '/css/' );
  done();
} );


// configure browser-sync to base project directory
gulp.task( 'browser-sync', function ( done ) {
  browserSync( {
    server: { baseDir: config.srcDir }, // set it if needed
    notify: false,
    open: false,
    // proxy: "your-url",
    // host: "your-ip-address",
    // tunnel: true,
    // tunnel: "projectname", //Demonstration page: http://projectname.localtunnel.me
  } );
  done();
} );

function reload( done ) {
  browserSync.reload();
  done();
}

// start browser watcher with auto-reload of page
gulp.task( 'watch', gulp.series( gulp.parallel( 'styles', 'js', 'browser-sync' ),
  function () {
    gulp.watch( [ config.srcDir + '/' + config.patterns.sass,
    // config.patterns.css,
    config.patterns.disableCssDir ],
      gulp.series( 'styles', reload ) );
    gulp.watch( [ //config.libsDir + '/**/*.js',
      config.srcDir + '/' + config.patterns.js,
      '!' + config.srcDir + '/' + config.patterns.disableCompiledJs ],
      gulp.series( 'js', reload ) );
    gulp.watch( [ config.patterns.php,
    config.patterns.disableModules ],
      gulp.series( reload ) );
    gulp.watch( [ config.srcDir + '/' + config.patterns.html ],
      gulp.series( reload ) );
  } ) );

gulp.task( 'css:dist', function ( done ) {
  return gulp.src( config.srcDir + '/' + config.patterns.sass )
    .pipe( sourcemaps.init() )
    .pipe( sass( { outputStyle: 'expand' } ).on( "error", notify.onError() ) )
    .pipe( debug( { title: 'input files:' } ) )
    .pipe( concat( 'main.min.css') )
    .pipe( debug( { title: 'concat into:' } ) )
    .pipe( autoprefixer( [ 'last 15 versions', '> 1%' ],
      {
        cascade: true
      } ) )
    .pipe( cleancss( { level: { 1: { specialComments: 0 } } } ) ) // Opt., comment out when debugging
    .pipe( sourcemaps.write( '.', { sourceRoot: config.srcDir } ) )
    .pipe( gulp.dest( config.distDir + '/css' ) );
  // done();
} );

gulp.task( 'js:dist', function ( done ) {
  return gulp.src( config.srcDir + '/js/+(scripts.min.js|components.min.js)' )
    .pipe( concat( 'scripts.min.js' ) )
    .pipe( uglify() )
    .pipe( gulp.dest( config.distDir + '/js' ) );
  // done();
} );

gulp.task( 'html:dist', function () {
  return gulp.src( config.srcDir + '/**/*.html' )
    .pipe( htmlclean() )
    .pipe( gulp.dest( config.distDir ) );
} );

gulp.task( 'img:dist', function () {
  return gulp.src( config.srcDir + '/img/**/*.*' )
    .pipe( gulp.dest( config.distDir + '/img' ) );
} );

gulp.task('fonts:dist', function () {
  return gulp.src( config.srcDir + '/fonts/**/*.*' )
    .pipe( gulp.dest( config.distDir + '/fonts' ) );
} );

gulp.task( 'php:dist', function () {
  return gulp.src( config.srcDir + '/php/**/*.php' )
    .pipe( gulp.dest(config.distDir + '/php') );
} );

gulp.task( 'docs:dist', function () {
  return gulp.src( config.srcDir + '/docs/**/*.*' )
    .pipe( gulp.dest( config.distDir + '/docs' ) );
} );

gulp.task( 'vendor:dist', function () {
  return gulp.src( './vendor/**/*.*' )
    .pipe( gulp.dest( config.distDir + '/vendor' ) );
} );

gulp.task( 'webfonts:dist', function () {
  return gulp.src( config.srcDir + '/webfonts/**/*.*' )
    .pipe( gulp.dest( config.distDir + '/webfonts' ) );
} );

gulp.task( 'clean', function ( done ) {
  return del( config.distDir , done );
} );

gulp.task( 'copy:dist',
  gulp.parallel(
    'html:dist',
    'css:dist',
    'js:dist',
    'img:dist',
    'fonts:dist',
    'php:dist',
    'docs:dist',
    'vendor:dist',
    'webfonts:dist'
  )
);

gulp.task( 'build', gulp.series( 'clean', 'copy:dist' ) );

gulp.task( 'default', gulp.series( 'watch' ) );
