const gulp = require('gulp');
const del = require('del');
const G = require('gulp-load-plugins')();

gulp.task('js', function () {
  return gulp.src('src/*.*')
    .pipe(G.if(
      '*.ts',
      G.typescript({
          noImplicitAny: true,
          outFile: 'ts.js',
          target: 'es6',
          noEmitOnError: true
      })
    ))
    .pipe(G.debug())
    .pipe(G.order([
      'ts.js', '*.js'
    ]))
    .pipe(G.concat('main.js'))
    .pipe(gulp.dest('build'))
    ;
});

gulp.task('watch', function () {
  gulp.watch([
    'src/*.*'
  ], gulp.series('js'));
});

gulp.task('clear', function () {
  return del(['build/*.*']);
});

gulp.task('vendor', function () {
  return gulp.src('./bower.json')
    .pipe(G.mainBowerFiles('**/*.js'))
    .pipe(G.concat('vendor.js'))
    .pipe(G.debug())
    .pipe(gulp.dest('build'))
  ;
});

gulp.task('default',
  gulp.series(
    'clear',
    gulp.parallel('js', 'vendor')
  )
);
