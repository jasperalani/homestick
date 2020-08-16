const gulp = require('gulp');
const sass = require('gulp-sass');


/* Sass */
const pre_path = './public/stylesheets';
const sass_SOURCE = pre_path + '/scss/**/*';
const sass_THEME = pre_path + '/scss/theme.scss';
const sass_DISTRIBUTION = pre_path + '/css';

gulp.task('copy-sass', function () {
  return gulp.src(sass_THEME)
  .pipe(sass())
  .pipe(gulp.dest(sass_DISTRIBUTION))
});

gulp.task('watch-sass', function () {
  gulp.watch(sass_SOURCE, gulp.series('copy-sass'));
});