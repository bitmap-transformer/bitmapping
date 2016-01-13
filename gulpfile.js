var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
gulp.task('default', ['eslint_check', 'mocha_tests', 'create_scripts_min_js', 'watch']);
gulp.task('function', function() {
  /* Place code for your "function" task here, what is run when:
  $gulp function
  is called. */
});
gulp.task('eslint_check', function() {
  return gulp.src(['**/*.js','!node_modules/**','!dist/*.js']).pipe(plugins.eslint(
    {
      'settings': {
        'ecmascript': 5
      },
      'ecmaFeatures': {
      },
      'env': {
        'browser': true,
        'jquery': true,
        'node': true,
        'mocha': true
      },
      'rules': {
        'semi': 1,
        'strict': 0,
        'indent': [2, 2],
        'quotes': [1, 'single'],
        'no-multi-spaces': [1, {
          'exceptions': {
            'VariableDeclarator': true,
            'FunctionExpression': true
          }
        }],
        'key-spacing': [0, {'align': 'value'}],
        'no-underscore-dangle': 0
      }
    }
  )).pipe(plugins.eslint.format()).pipe(plugins.eslint.failAfterError());
});
gulp.task('mocha_tests', function () {
  return gulp.src('test/*.js', {read: false}).pipe(plugins.mocha({reporter: 'nyan'}));
});
gulp.task('create_scripts_min_js', function() {
  return gulp.src('lib/*.js').pipe(plugins.concat('scripts.js'))
      .pipe(gulp.dest('dist'))
      .pipe(plugins.rename('scripts.min.js'))
      .pipe(plugins.uglify())
      .pipe(gulp.dest('dist'));
});
gulp.task('watch', function() {
  gulp.watch(['**/*.js', '!package.json', '!node_modules/**', '!dist/*.js'], ['eslint_check', 'mocha_tests', 'create_scripts_min_js']);
});
