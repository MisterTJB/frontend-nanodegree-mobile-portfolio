var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');

gulp.task('minify-html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function() {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('minify-js', function () {
    gulp.src('src/js/*.js')
        .pipe(jsmin())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function () {
     gulp
      .src('src/img/*')
      .pipe(gulp.dest('dist/img'));
});
