var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();

// Process Pug files
gulp.task('html', function(){
  return gulp.src('src/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
});

// Process Sass files
gulp.task('css', function(){
  return gulp.src('src/assets/css/main.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.stream());
});

// Minify and Concat JS
gulp.task('js', function(){
  return gulp.src('src/assets/js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

// Optimize images
gulp.task('imageMin', function(){
  return gulp.src('src/assets/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/img'))
});

gulp.task('default', ['html', 'css', 'js', 'imageMin' ], function() {
  // Serve files from the dist folder of this project
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
    gulp.watch('src/assets/css/**/*', ['css']);
    gulp.watch('src/*.pug', ['html']);
    gulp.watch('src/assets/img/*', ['imageMin']);
    gulp.watch("src/assets/js/*.js", ['js-watch']);
});
