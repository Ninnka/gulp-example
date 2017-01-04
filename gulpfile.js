var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCss = require("gulp-minify-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

// 任务：输出文本
gulp.task("test", function () {
  return console.log("gulp test");
});

// 任务：复制文件
gulp.task("copy", function () {
  return gulp.src("./src/template/*.html")
    .pipe(gulp.dest("./dest/"));
});

// 任务：将多个js文件打包成一个js文件
gulp.task("concatjs", function () {
  gulp.src("./src/js/*.js")
    .pipe(concat("main.js"))
    .pipe(gulp.dest("./dest/static/"));
});

// 任务：编译sass为css，并压缩
gulp.task("sass", function (done) {
  gulp.src("./src/sass/*.sass")
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(gulp.dest("./dest/static/"))
    .pipe(minifyCss())
    .pipe(rename({
      extname: ".min.css"
    }))
    .pipe(gulp.dest("./dest/static/"))
    .on("end", done);
});

// 任务：返回一个babel转换后的流
var babelstream;
gulp.task("babelstream", function () {
  babelstream = gulp.src("./src/js/*.js")
    .pipe(babel({
      presets: ["es2015"]
    }));
});

// 任务：压缩和混淆js文件，不支持es2015
gulp.task("uglify-babel", ["babelstream"], function () {
  // gulp.src("./src/js/*.js")
  // .pipe(babel({
  //   presets: ["es2015"]
  // }))
  babelstream
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dest/static/'));
});

// 任务：将es6转换为es5
gulp.task("babel", ["babelstream"], function () {
  // gulp.src("./src/js/*.js")
  //   .pipe(babel({
  //     presets: ['es2015']
  //   }))
  babelstream
    .pipe(gulp.dest("./dest/static/"));
});

gulp.task("watch", function () {
  var watchcer = gulp.watch("./src/js/*.js", []);
  watchcer.on("change", function (event) {
    console.log("change");
  });
});


// 开发环境
gulp.task("dev", ["sass"], function () {

});

// 任务：复制html文件
gulp.task("html", function () {
  gulp.src("./src/template/*.html")
    .pipe(gulp.dest("./dest/"));
});

// 任务：复制css文件
gulp.task("css", function () {
  gulp.src("./src/css/*.css")
    .pipe(gulp.dest("./dest/static"));
});

// 任务：复制js文件
gulp.task("js", function () {
  gulp.src("./src/js/*.js")
    .pipe(gulp.dest("./dest/static"));
});

// 任务：序列任务
gulp.task("build", ["sass", "js"]);
