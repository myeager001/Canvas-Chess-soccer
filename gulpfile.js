var gulp = require('gulp');
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')

gulp.task('default', ['minify', 'copyHtml', 'copyCss', 'copyImages']);

gulp.task('minify', function(){
  return gulp.src(['./src/js/game.js','./src/js/api.js', './src/js/nav.js' ])
  .pipe(concat('main.js'))
  .pipe(gulp.dest('./src/js'))
  .pipe(uglify()).pipe(gulp.dest('./build/js'))
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
