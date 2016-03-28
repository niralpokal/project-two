var gulp = require('gulp');
var nodemon = require('gulp-nodemon')


gulp.task('copy', function(){
  return gulp.src(['./default.js', './index.html', './css/default.css','./images/*.png'], {base: '.'}) 
  .pipe(gulp.dest('./public/'));
});


gulp.task('default', ['copy'], function(){
  nodemon({
    script: 'app.js'
  })
})
