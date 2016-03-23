// gulpfile.js
var gulp = require('gulp');
var concat = require('gulp-concat');
var all = require('gulp-all');
var eslint = require('gulp-eslint');
var inlineAngularTemplates = require('gulp-inline-angular-templates');
var htmlreplace = require('gulp-html-replace');
var watch = require('gulp-watch');
var connect = require('gulp-connect');

/* Note: uglify ne gère pas encore ES6 donc je me contente de concaténer les fichiers, sans minification.
 * Les grosses librairies JS sont prises en version déjà minifiée donc ça ne change pas grand chose. */

// concat et copie toutes les resources nécessaires au déploiement dans ./build
gulp.task("build", function build() {
  return all([
    gulp.src('app/**/*.html')
      .pipe(inlineAngularTemplates('index.html', {
           base: 'partials',
           prefix: 'partials/',
           method: 'prepend',
           unescape: {
               '&lt;': '<',
               '&gt;': '>',
               '&apos;': '\'',
               '&amp;': '&'
           }
       }))
      .pipe(htmlreplace({
        'css': ['app/css/vendor.css', 'app/css/app.css'],
        'js': ['app.js/vendor.js', 'app/js/app.js']
      }))
      .pipe(gulp.dest('build/')),

    gulp.src('app/js/*.js')
      .pipe(concat("app.js"))
      .pipe(gulp.dest('build/js/')),

    gulp.src('app/css/*.css')
      .pipe(concat("app.css"))
      .pipe(gulp.dest('build/css/')),

    gulp.src('app/js/d3/*.js')
      .pipe(gulp.dest('build/js/d3/')),

    gulp.src(['node_modules/angular/angular.min.js',
          'node_modules/angular-route/angular-route.min.js',
          'node_modules/angular-animate/angular-animate.min.js',
          'node_modules/angular-aria/angular-aria.min.js',
          'node_modules/angular-messages/angular-messages.min.js',
          'node_modules/angular-material/angular-material.min.js'])
      .pipe(concat("vendor.js"))
      .pipe(gulp.dest('build/js/')),

    gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css',
             'node_modules/angular-material/angular-material.css'])
      .pipe(concat("vendor.css"))
      .pipe(gulp.dest('build/css/')),

    gulp.src('node_modules/bootstrap/dist/fonts/*')
      .pipe(gulp.dest('build/fonts/')),

    gulp.src('app/img/*')
      .pipe(gulp.dest('build/img/')),

    gulp.src('favicon.ico')
      .pipe(gulp.dest('build/'))
    ])
});

gulp.task('eslint', function() {
  return gulp.src('app/js/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task('watch', function () {
  gulp.watch('app/*.html', ['build']);
  gulp.watch('app/partials/**/*.html', ['build']);
  gulp.watch('app/css/**/*.css', ['build']);
  gulp.watch('app/js/**/*.js', ['build']);
});

gulp.task('connect', function() {
  connect.server({
      root: ['app', 'node_modules']
  });
});

gulp.task('default', ['connect', 'watch']);
