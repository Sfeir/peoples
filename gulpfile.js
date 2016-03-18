// gulpfile.js
var gulp = require('gulp');
var concat = require('gulp-concat');
var all = require('gulp-all');
var inlineAngularTemplates = require('gulp-inline-angular-templates');
var htmlreplace = require('gulp-html-replace');
var watch = require('gulp-watch');
var connect = require('gulp-connect');

/* Note: uglify ne gère pas encore ES6 donc je me contente de concaténer les fichiers, sans minification.
 * Les grosses librairies JS sont prises en version déjà minifiée donc ça ne change pas grand chose. */

// concat et copie toutes les resources nécessaires au déploiement dans ./build
gulp.task("build", function build() {
  return all([
    gulp.src('partials/*.html')
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
        'css': ['css/vendor.css', 'css/app.css'],
        'js': ['js/vendor.js', 'js/app.js']
      }))
      .pipe(gulp.dest('build/')),

    gulp.src('js/*.js')
      .pipe(concat("app.js"))
      .pipe(gulp.dest('build/js/')),

    gulp.src('css/*.css')
      .pipe(concat("app.css"))
      .pipe(gulp.dest('build/css/')),

    gulp.src('js/d3/*.js')
      .pipe(gulp.dest('build/js/d3/')),

    gulp.src(['./bower_components/angular/angular.min.js',
          'bower_components/angular-route/angular-route.min.js',
          'bower_components/angular-animate/angular-animate.min.js',
          'bower_components/angular-aria/angular-aria.min.js',
          'bower_components/angular-messages/angular-messages.min.js',
          'bower_components/angular-material/angular-material.min.js'])
      .pipe(concat("vendor.js"))
      .pipe(gulp.dest('build/js/')),

    gulp.src(['bower_components/bootstrap/dist/css/bootstrap.min.css',
             'bower_components/angular-material/angular-material.css'])
      .pipe(concat("vendor.css"))
      .pipe(gulp.dest('build/css/')),

    gulp.src('bower_components/bootstrap/dist/fonts/*')
      .pipe(gulp.dest('build/fonts/')),

    gulp.src('img/*')
      .pipe(gulp.dest('build/img/')),

    gulp.src('favicon.ico')
      .pipe(gulp.dest('build/'))
    ])
});

gulp.task('watch', function () {
  gulp.watch('*.html', ['build']);
  gulp.watch('partials/**/*.html', ['build']);
  gulp.watch('css/**/*.css', ['build']);
  gulp.watch('js/**/*.js', ['build']);
});

gulp.task('connect', function() {
  connect.server();
});

gulp.task('default', ['connect', 'watch']);
