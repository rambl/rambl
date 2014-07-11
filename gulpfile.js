var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
  scripts: ['client/lib/angular.min.js']
}

gulp.task('build', function () {
  return gulp.task(paths.scripts)
    .pipe(uglify())
    .pipe(concat('built.min.js'))
    .pipe('client'); 
});