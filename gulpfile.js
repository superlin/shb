var gulp         = require('gulp');

var browserSync  = require('browser-sync');
var server       = require('gulp-develop-server');

var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss    = require('gulp-minify-css');

var base = './public/';
var paths = {
  js:       base + 'js/*.js',
  scss:     base + 'scss/*.scss',
  views:    'views/**/*'
};

var source = Object.keys(paths).map(function(k) {return paths[k];});

gulp.task('server:start', function () {
    var application_server = server.listen({ 
        path : './app.js',
        execArgv : ['--debug']
    });

    gulp.watch(['./app.js'], application_server.restart);
});

gulp.task('browser-sync-server', function () {
    browserSync({
        port: 3333,
        minify : true,
        ghostMode :{
            clicks: true,
            scroll: true
        },
        proxy: "localhost:3000",
        ui: {
            weinre: {
                port: 9090
            }
        }
    });
});

gulp.task('browser-reload', function () {
    browserSync.reload(); 
});

gulp.task('repl', ['browser-sync-server'], function () {
    gulp.watch(source, ['browser-reload']);
});

gulp.task('scss', function () {
  return gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function () {
  gulp.watch(paths.scss, ['scss']);
});

gulp.task('default', ['scss', 'browser-sync-server', 'repl', 'watch', 'server:start']);
