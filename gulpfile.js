var gulp = require('gulp');

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var minify = require('gulp-minifier');
var postcss = require('gulp-postcss');
var autoprefix = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var pngquant = require('pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

var baseDirs = {
  app: './',
  dist: './dist/'
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
  css: [bowerComponentsDir + '**/*.min.css', baseDirs.app + 'public/css/**/*.css'],
  img: [baseDirs.app + 'public/img/**/*'],
  index: [baseDirs.app + 'views/index.pug']
};

var concatFilenames = {
  js: 'script.js',
  css: 'stylesheet.css'
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

gulp.task('dev:concatjs', function () {
  return gulp.src(appFiles.js)
    .pipe(sourcemaps.init())
    .pipe(concat(concatFilenames.js))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(baseDirs.app + publicDirs.js));
});

gulp.task('dev:concatcss', function () {
  return gulp.src(appFiles.css)
    .pipe(sourcemaps.init())
    .pipe(concat(concatFilenames.css))
    .pipe(postcss([autoprefix({ browsers: ['last 2 versions'] })]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(baseDirs.app + publicDirs.css));
});

gulp.task('nodemon', function () {
  nodemon({
      script: baseDirs.app + startupScript,
      ext: 'js',
      /*ignore: [
        baseDirs.app + 'public/',
        baseDirs.app + 'js/',
        baseDirs.app + 'css/']*/
    })
    .on('restart', function () {
      console.log('Magic restarted');
    });
});

gulp.task('livereload', ['dev:concatjs', 'dev:concatcss'], function () {
  return gulp.src(appFiles.index)
    .pipe(livereload());
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch([
      appFiles.js,
      appFiles.css,
      baseDirs.app + '**/*.pug',
    ], ['livereload'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['dev:concatjs', 'dev:concatcss', 'nodemon', 'watch']);
gulp.task('dist', ['dist:copy']);

gulp.task('dist:minifycss', ['dev:concatcss'], function() {
  return gulp.src(baseDirs.app + publicDirs.css + concatFilenames.css)
    .pipe(minify({
      minify: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest(baseDirs.dist + publicDirs.css));
});

gulp.task('dist:minifyjs', ['dev:concatjs'], function() {
  return gulp.src(baseDirs.app + publicDirs.js + concatFilenames.js)
    .pipe(minify({
      minify: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true
    }))
    .pipe(gulp.dest(baseDirs.dist + publicDirs.js));
});

gulp.task('dist:minifyimg', function () {
    return gulp.src(appFiles.img)
        .pipe(cache(imagemin({
          optimizationLevel: 7,
          progressive: true,
          interlaced: true,
          use: [pngquant(), imageminJpegRecompress()]
        })))
        .pipe(gulp.dest(baseDirs.app + publicDirs.img))
        //.pipe(gulp.dest(baseDirs.dist + publicDirs.img))
});

gulp.task('dist:copy', ['dist:minifycss', 'dist:minifyjs', 'dist:minifyimg'], function() {
  // server.js
  gulp.src(baseDirs.app + '/' + startupScript)
    .pipe(gulp.dest(baseDirs.dist));

  // sysDirs
  gulp.src(sysDirs, {cwd: baseDirs.app + '**'})
    .pipe(gulp.dest(baseDirs.dist));
});