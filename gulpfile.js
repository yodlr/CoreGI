var gulp = require('gulp');

var ANGULAR = {
  js: {
    files: [
      './bower_components/angular/angular.js',
      './bower_components/angular/angular.min.js',
      './bower_components/angular/angular.min.js.map',
      './bower_components/angular-resource/angular-resource.js',
      './bower_components/angular-resource/angular-resource.min.js',
      './bower_components/angular-resource/angular-resource.min.js.map',
      './bower_components/angular-route/angular-route.js',
      './bower_components/angular-route/angular-route.min.js',
      './bower_components/angular-route/angular-route.min.js.map'
    ],
    dest: './site/vendors/js'
  }
};

var BOOTSTRAP = {
  js: {
    files: [
      './bower_components/bootstrap/dist/js/bootstrap.js',
      './bower_components/bootstrap/dist/js/bootstrap.min.js'
    ],
    dest: './site/vendors/js'
  },
  css: {
    files: [
      './bower_components/bootstrap/dist/css/bootstrap.css',
      './bower_components/bootstrap/dist/css/bootstrap.min.css',
      './bower_components/bootstrap/dist/css/bootstrap.css.map'
    ],
    dest: './site/vendors/css'
  },
  fonts: {
    files: [
      './bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
      './bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
      './bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
      './bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff'
    ],
    dest: './site/vendors/fonts'
  }
};

var JQUERY = {
  js: {
    files: [
      './bower_components/jquery/dist/jquery.js',
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/jquery/dist/jquery.min.map'
    ],
    dest: './site/vendors/js'
  },
};

gulp.task('angular', ['angular-js']);
gulp.task('angular-js', function() {
  return gulp.src(ANGULAR.js.files).pipe(gulp.dest(ANGULAR.js.dest));
});

gulp.task('bootstrap', ['bootstrap-js', 'bootstrap-css', 'bootstrap-fonts']);
gulp.task('bootstrap-js', function() {
  return gulp.src(BOOTSTRAP.js.files).pipe(gulp.dest(BOOTSTRAP.js.dest));
});
gulp.task('bootstrap-css', function() {
  return gulp.src(BOOTSTRAP.css.files).pipe(gulp.dest(BOOTSTRAP.css.dest));
});
gulp.task('bootstrap-fonts', function() {
  return gulp.src(BOOTSTRAP.fonts.files).pipe(gulp.dest(BOOTSTRAP.fonts.dest));
});

gulp.task('jquery', ['jquery-js']);
gulp.task('jquery-js', function() {
  return gulp.src(JQUERY.js.files).pipe(gulp.dest(JQUERY.js.dest));
});

// Default Taskp
gulp.task('default', ['angular', 'bootstrap', 'jquery']);
