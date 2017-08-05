var gulp = require('gulp');

var autoprefix = require('autoprefixer');
var cache = require('gulp-cache');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var ifElse = require('gulp-if-else');
var imagemin = require('gulp-imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var minify = require('gulp-minifier');
var nodemon = require('gulp-nodemon');
var path = require('path');
var pngquant = require('pngquant');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var yargs = require('yargs');

var baseDirs = {
  app: './',
  dist: './'
};

var publicDirs = {
  _self: 'public/',
  js: 'public/js/',
  css: 'public/css/',
  img: 'public/img/'
};

var bowerComponentsDir = baseDirs.app + 'public/libs/';

// Bower components first!
var appFiles = {
  js: [bowerComponentsDir + '**/*.min.js', baseDirs.app + 'public/js/**/*.js'],
  angular: ['!' + baseDirs.app + 'src/angular/**/*.inc.*', baseDirs.app + 'src/angular/libs/*.js', baseDirs.app + 'src/angular/app/**/*.js'],
  css: [bowerComponentsDir + '**/*.min.css'],
  less: ['!' + baseDirs.app + 'src/less/**/*.inc.*', baseDirs.app + 'src/less/**/*.less'],
  img: [baseDirs.app + 'public/img/**/*'],
  index: [baseDirs.app + 'views/index.pug']
};

var concatFilenames = {
  js: 'app.js',
  css: 'styles.css'
};

var startupScript = 'server.js';

var sysDirs = [
  baseDirs.app + 'app/**/*.js',
  baseDirs.app + 'config/**/*.js',
  baseDirs.app + 'views/**/*.pug',
  baseDirs.app + 'node_modules/'
];

gulp.task('clean', function() {
  return gulp.src(baseDirs.dist, {read: false}).pipe(clean());
});

gulp.task('livereload', ['dist:compileless'], function () {
  return gulp.src(appFiles.index)
    .pipe(livereload());
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch([
      appFiles.js,
      appFiles.css,
      appFiles.less
      //baseDirs.app + '**/*.pug',
    ], ['livereload'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

// Compiled list of Gulp tasks =========================================
gulp.task('default', [/*'dev:concatjs',*/ /*'dev:concatcss',*/ /*'nodemon',*/ 'watch']);
//gulp.task('dist', ['dist:copy']);

/**
 * NOTE: To make compiling easier, save commands to a file
 *       This is suggested since by default, compiler compiles files
 *       in alphabetical order. Thus, unless you list all file names
 *       in the order you need them to be compiled and concated in,
 *       you'll run into issues.
 * 
 * TODO: Future reference, DON'T BE LAZY. Split the concat/minifying
 *       process and the compiling process into two tasks. Then create
 *       a task that uses both.
 * 
 * BASH command: gulp `< [path-to-file-with-command]`
 */

// LESS Dist Processing ================================================
var lessarg = yargs.array('files')
  .default({
    'concat': false,
    'files': appFiles.less,
    'minify': false,
    'output': concatFilenames.css,
    'sourcemaps': false,
  })
  .argv;

gulp.task('dist:compileless', function () {
  return gulp.src(lessarg.files)
    .pipe(ifElse(lessarg.sourcemaps, function() {
      return sourcemaps.init();
    }))
    .pipe(less({
      paths: [ path.join(__dirname, 'src', 'less', 'includes') ]
    }))
    .pipe(ifElse(lessarg.concat, function() {
      return concat(lessarg.output);
    }))
    .pipe(postcss([autoprefix({ browsers: ['last 2 versions'] })]))
    .pipe(ifElse(lessarg.minify, function() {
      return minify({
        minify: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
        getKeptComment: function (content, filePath) {
          var m = content.match(/\/\*![\s\S]*?\*\//img);
          return m && m.join('\n') + '\n' || '';
        }
      });
    }))
    .pipe(ifElse(lessarg.sourcemaps, function() {
      return sourcemaps.write('.');
    }))
    .pipe(gulp.dest(baseDirs.dist + publicDirs.css));
});

// JS Dist Processing ==================================================
var cjsarg = yargs.array('files')
  .default({
    'files': false,
    'minify': false,
    'output': concatFilenames.js,
    'sourcemaps': false,
  })
  .argv;

gulp.task('dist:concatjs', function() {
  // add in default files if custom files specified
  if(cjsarg.files[0] === false){
    cjsarg.files = appFiles.angular;
  }

  // continue gulp processing
  return gulp.src(cjsarg.files)
    .pipe(ifElse(cjsarg.sourcemaps, function() {
      return sourcemaps.init();
    }))
    .pipe(concat(cjsarg.output))
    .pipe(ifElse(cjsarg.minify, function() {
      return minify({
        minify: true,
        // collapseWhitespace: true,
        // conservativeCollapse: true,
        minifyJS: true,
        getKeptComment: function (content, filePath) {
          var m = content.match(/\/\*![\s\S]*?\*\//img);
          return m && m.join('\n') + '\n' || '';
        }
      });
    }))
    .pipe(ifElse(cjsarg.sourcemaps, function() {
      return sourcemaps.write('.');
    }))
    .pipe(gulp.dest(baseDirs.dist + publicDirs.js)); 
})

// Image minification ==================================================
gulp.task('dist:minifyimg', function () {
    return gulp.src(appFiles.img)
        .pipe(cache(imagemin({
          optimizationLevel: 7,
          progressive: true,
          interlaced: true,
          use: [pngquant(), imageminJpegRecompress()]
        })))
        //.pipe(gulp.dest(baseDirs.app + publicDirs.img))
        .pipe(gulp.dest(baseDirs.dist + publicDirs.img))
});

// Distribution Processing =============================================
/*gulp.task('dist:copy', ['dist:minifycss', 'dist:minifyjs', 'dist:minifyimg'], function() {
  // server.js
  gulp.src(baseDirs.app + '/' + startupScript)
    .pipe(gulp.dest(baseDirs.dist));

  // sysDirs
  gulp.src(sysDirs, {cwd: baseDirs.app + '**'})
    .pipe(gulp.dest(baseDirs.dist));
});*/