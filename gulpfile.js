var gulp = require('gulp');
var eslint = require('gulp-eslint');
var rev = require('gulp-rev');
var usemin = require('gulp-usemin');
var connect = require('gulp-connect');
var replace = require('gulp-replace');
var merge = require('merge-stream');
var ghPages = require('gulp-gh-pages');
var argv = require('yargs').argv;

var fs = require('fs');

var del = require('del');
var browserSync = require('browser-sync').create();


gulp.task('copy', ['clean'], function build() {
    var fonts = gulp.src('node_modules/bootstrap/dist/fonts/*')
      .pipe(gulp.dest('build/fonts/'));

    var imgs = gulp.src('app/img/**/*')
      .pipe(gulp.dest('build/img/'));

    var mocks = gulp.src('app/mocks/*')
      .pipe(gulp.dest('build/mocks/'));

    var templates = gulp.src('app/js/**/*.html')
      .pipe(gulp.dest('build/templates/'));

    if (argv.step) {
        gulp.src(argv.step + '/**/*')
          .pipe(gulp.dest('build/'));
    }

    return merge(fonts, imgs, mocks, templates);
});

gulp.task('eslint', function() {
    return gulp.src('app/js/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: ['./app', './node_modules']
        },
        port: 8080
    });
    gulp.watch('app/**/*.html').on('change', function(evt) {
        browserSync.reload();
    });
    gulp.watch('app/css/**/*.css').on('change', function(evt) {
        browserSync.reload();
    });
    gulp.watch('app/js/**/*.js').on('change', function(evt) {
        browserSync.reload();
    });
});

gulp.task('reload', ['copy', 'usemin', 'update-sw-try'], browserSync.reload);

gulp.task('watch-try', function() {
    browserSync.init({
        server: {
            baseDir: ['./build']
        },
        port: 8080
    });
    gulp.watch(['app/**/*.html', 'app/css/**/*.css', 'app/js/**/*.js', argv.step + '/**/*'], ['reload']);
});

gulp.task('update-sw-try', ['usemin'], function() {
    var css = fs.readdirSync('build/css');
    var js = fs.readdirSync('build/js');
    var sw = gulp.src('build/service-worker.js')
      .pipe(replace(/CSS_APP/, 'css/' + css[0]))
      .pipe(replace(/CSS_VENDOR/, 'css/' + css[1]))
      .pipe(replace(/JS_APP/, 'js/' + js[0]))
      .pipe(replace(/JS_VENDOR/, 'js/' + js[1]))
      .pipe(gulp.dest('build'));

    var initsw = gulp.src('app/js/initSw.js')
      .pipe(gulp.dest('build/js/'));

    var manifest = gulp.src('app/manifest/manifest.json')
      .pipe(gulp.dest('build/manifest'));

    return merge(sw, initsw, manifest);
});

gulp.task('usemin', ['copy'], function() {
    return gulp.src('app/index.html')
      .pipe(usemin({
          css: ['concat', function() { return rev(); }],
          js: ['concat', replace(/templateUrl:\s*\'\.\/js\/components\/directives(.*)\'/, "templateUrl: './templates$1'"), rev()],
          jsapp: ['concat', replace(/templateUrl:\s*\'\.\/js(.*)\'/g, "templateUrl: './templates$1'"), rev()]
      }))
      .pipe(gulp.dest('build/'));
});

gulp.task('gh-pages', ['copy', 'usemin', 'update-sw', 'add-urlfolder'], function() {
    return gulp.src('./build/**/*').pipe(ghPages({force: true}));
});

gulp.task('update-sw', ['usemin'], function() {
    var css = fs.readdirSync('build/css');
    var js = fs.readdirSync('build/js');
    var sw = gulp.src('app/service-worker.js')
      .pipe(replace(/CSS_APP/, 'css/' + css[0]))
      .pipe(replace(/CSS_VENDOR/, 'css/' + css[1]))
      .pipe(replace(/JS_APP/, 'js/' + js[0]))
      .pipe(replace(/JS_VENDOR/, 'js/' + js[1]))
      .pipe(replace(/'\/'/, "'/peoples/'"))
      .pipe(gulp.dest('build'));

    var initsw = gulp.src('app/js/initSw.js')
      .pipe(gulp.dest('build/js/'));

    var manifest = gulp.src('app/manifest/manifest.json')
      .pipe(gulp.dest('build/manifest'));

    return merge(sw, initsw, manifest);
});

gulp.task('connect-build', ['clean', 'usemin'], function() {
    return connect.server({
        root: ['build']
    });
});

gulp.task('clean', function(cb) {
    return del('build');
});

gulp.task('default', ['watch']);
gulp.task('sw-ready', ['connect-build', 'copy', 'usemin', 'update-sw']);
gulp.task('try', ['copy', 'usemin', 'update-sw-try', 'watch-try']);
gulp.task('deploy', ['gh-pages']);
