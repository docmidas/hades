// Require dependencies
var gulp = require('gulp'),
    less = require('gulp-less'),
    gls  = require('gulp-live-server');


gulp.task("less", function() {
  gulp.src("./src/public/less/style.less")
    .pipe(less())
    .pipe(gulp.dest("./src/public/css"));
});

// Run a local server
gulp.task('server', function() {
  var server = gls('./src/index.js', {NODE_ENV: 'development', PORT: 3000});
  server.start(); // Start the server

  gulp.watch(['gulpfile.js', './src/index.js', './src/controllers/**/*.js'], function() {
    server.start.bind(server)()
  });
});

gulp.task("watch", function() {
  gulp.watch(["./src/public/less/**/*.less"], ["less"]);
});


gulp.task("default", ["watch", "less", "server"])
