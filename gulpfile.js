var gulp = require('gulp');
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')

gulp.task('default', ['minify', 'copyHtml', 'copyCss', 'copyImages']);

gulp.task('minify', function(){
  return gulp.src('./src/**/*.js')
  .pipe(concat('main.js'))
  .pipe(uglify()).pipe(gulp.dest('./build'))
});

gulp.task('copyHtml', function(){
  return gulp.src('./src/**/*.html')
  .pipe(gulp.dest('./build'))
});

gulp.task('copyCss', function(){
  return gulp.src('./src/**/*.css')
  .pipe(gulp.dest('./build'))
});

gulp.task('copyImages', function(){
  return gulp.src('./src/**/*.png')
  .pipe(gulp.dest('./build'))
});
