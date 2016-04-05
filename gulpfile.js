var gulp = require('gulp');
var eslint = require('gulp-eslint');
var rev = require('gulp-rev');
var usemin = require('gulp-usemin');
var connect = require('gulp-connect');
var replace = require('gulp-replace');
var del = require('del');

gulp.task('copy', ['clean'], function build() {
    gulp.src('node_modules/bootstrap/dist/fonts/*')
      .pipe(gulp.dest('build/fonts/'));

    gulp.src('app/img/*')
      .pipe(gulp.dest('build/img/'));

    gulp.src('app/mocks/*')
      .pipe(gulp.dest('build/mocks/'));

    gulp.src('app/js/**/*.html')
      .pipe(gulp.dest('build/templates/'));
});

gulp.task('eslint', function() {
    return gulp.src('app/js/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task('watch', function() {
    gulp.watch('app/*.html', []);
    gulp.watch('app/partials/**/*.html', []);
    gulp.watch('app/css/**/*.css', []);
    gulp.watch('app/js/**/*.js', []);
});

gulp.task('usemin', ['clean'], function() {
    return gulp.src('app/index.html')
      .pipe(usemin({
          css: ['concat', function(){return rev();}],
          js: ['concat', replace(/templateUrl:\s*\'\.\/js\/components\/directives(.*)\'/, "templateUrl: './templates$1'"), rev()],
          jsapp: ['concat', replace(/templateUrl:\s*\'\.\/js(.*)\'/g, "templateUrl: './templates$1'"), rev()]
      }))
      .pipe(gulp.dest('build/'));
});

gulp.task('connect', function() {
    connect.server({
        root: ['app', 'node_modules']
    });
});

gulp.task('connect-build', ['clean', 'usemin'], function() {
    return connect.server({
        root: ['build']
    });
});

gulp.task('clean', function(cb) {
    return del('build');
});

gulp.task('default', ['connect']);
gulp.task('sw-ready', ['connect-build', 'copy', 'usemin']);
gulp.task('build', ['connect', 'watch']);
gulp.task('deploy', ['build', 'gh-pages']);
